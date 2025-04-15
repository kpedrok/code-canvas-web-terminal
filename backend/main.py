import asyncio
import os

import docker
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import database modules
from app.db.database import engine, get_db
from app.db.models import Base
from app.db.repository import ProjectRepository, UserRepository

# Import route handlers
from app.routes import auth, files, projects_auth, terminal, health

app = FastAPI()

# Add CORS middleware to allow connections from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Determine if we're running locally or on fly.io
is_production = os.environ.get("FLY_APP_NAME") is not None

# Set data directory based on environment
if os.environ.get("DATA_DIR"):
    # Use the environment variable if provided
    DATA_DIR = os.environ.get("DATA_DIR")
elif is_production:
    # Use fly.io volume mount in production
    DATA_DIR = "/data/users"
else:
    # Use local directory for development
    DATA_DIR = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "persistent_data/users"
    )

print(f"Using data directory: {DATA_DIR}")

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

docker_client = docker.from_env()
user_sessions = {}


# Create database tables at startup
@app.on_event("startup")
async def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables created")


# Include route modules
app.include_router(files.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(projects_auth.router, prefix="/api")
app.include_router(terminal.router, prefix="/api")
app.include_router(health.router)


@app.get("/")
def read_root():
    return {"message": "Web Terminal API is running"}


@app.websocket("/ws/{user_id}/{project_id}")
async def terminal_ws(websocket: WebSocket, user_id: str, project_id: str):
    await websocket.accept()

    try:
        # Send a welcome message to confirm connection
        await websocket.send_text("Connected to terminal. Starting container...\n")

        # Create user and project directory if it doesn't exist
        user_project_dir = os.path.join(DATA_DIR, user_id, project_id)
        os.makedirs(user_project_dir, exist_ok=True)

        # Get absolute path for Docker volume mount
        # This is critical for Docker Desktop on macOS
        host_path = os.path.abspath(user_project_dir)
        if os.environ.get("HOST_DATA_DIR"):
            # If running in Docker, we need to map the container path to host path
            container_path = os.path.join(DATA_DIR, user_id, project_id)
            host_path = container_path.replace(
                DATA_DIR, os.environ.get("HOST_DATA_DIR")
            )
            print(
                f"Mounting volume: Container path {container_path} -> Host path {host_path}"
            )

        # Ensure everyone can read/write to this directory
        os.system(f"chmod -R 777 {user_project_dir}")

        # Create a unique session key from user_id and project_id
        session_key = f"{user_id}:{project_id}"

        # Create or get user session
        if session_key not in user_sessions:
            # Create a new Docker container for this session with volume mount
            print(f"Creating container with volume mount: {host_path}:/workspace")
            container = docker_client.containers.run(
                "python:3.12-slim",
                command="bash",
                stdin_open=True,
                tty=True,
                detach=True,
                remove=True,  # Auto-remove when stopped
                volumes={host_path: {"bind": "/workspace", "mode": "rw"}},
                working_dir="/workspace",
                environment={
                    "USER_ID": user_id,
                    "PROJECT_ID": project_id,
                    "TERM": "xterm-256color",
                },
            )

            # Store session info
            user_sessions[session_key] = {
                "container": container,
                "container_id": container.id,
                "last_active": asyncio.get_event_loop().time(),
            }

            await websocket.send_text(
                f"Container started with ID: {container.id[:12]}\n"
            )

        session = user_sessions[session_key]
        container = session["container"]
        # Update last active timestamp
        session["last_active"] = asyncio.get_event_loop().time()

        # Function to execute commands and stream output
        async def execute_command(cmd):
            exec_result = container.exec_run(cmd, stream=True, demux=True)

            for chunk in exec_result.output:
                stdout, stderr = chunk
                if stdout:
                    await websocket.send_text(stdout.decode("utf-8", errors="ignore"))
                if stderr:
                    await websocket.send_text(stderr.decode("utf-8", errors="ignore"))

        # Send initial container info and prompt
        await execute_command(
            "echo 'Web Terminal ready. Type commands and press Enter. Your files are stored in /workspace'"
        )
        await websocket.send_text("\n$ ")

        # Process commands from the client
        while True:
            cmd = await websocket.receive_text()
            # Update last active timestamp
            session["last_active"] = asyncio.get_event_loop().time()

            if cmd.strip().lower() in ["exit", "quit"]:
                await websocket.send_text("Closing session...\n")
                break

            if cmd.strip():
                # Log command for debugging
                print(f"Executing command: {cmd}")

                try:
                    # Execute the command without streaming for more reliable output
                    exec_result = container.exec_run(
                        cmd=f"/bin/bash -c '{cmd}'",
                        demux=True,  # Split stdout and stderr
                    )

                    # Output the results
                    exit_code = exec_result.exit_code
                    stdout, stderr = exec_result.output

                    print(f"Command exit code: {exit_code}")

                    if stdout:
                        stdout_text = stdout.decode("utf-8", errors="ignore")
                        print(f"STDOUT: {stdout_text}")
                        await websocket.send_text(stdout_text)

                    if stderr:
                        stderr_text = stderr.decode("utf-8", errors="ignore")
                        print(f"STDERR: {stderr_text}")
                        await websocket.send_text(stderr_text)

                    if not stdout and not stderr:
                        print("No output from command")

                except Exception as e:
                    error_msg = f"Error executing command: {str(e)}\n"
                    print(error_msg)
                    await websocket.send_text(error_msg)

                # Send a new prompt
                await websocket.send_text("$ ")

    except WebSocketDisconnect:
        # Clean up resources
        session_key = f"{user_id}:{project_id}"
        if session_key in user_sessions:
            try:
                session = user_sessions[session_key]
                session["container"].stop()
                del user_sessions[session_key]
            except Exception as e:
                print(f"Error cleaning up: {str(e)}")

    except Exception as e:
        # Handle other exceptions
        try:
            await websocket.send_text(f"Error: {str(e)}\n")
        except:
            pass

        # Clean up
        session_key = f"{user_id}:{project_id}"
        if session_key in user_sessions:
            try:
                session = user_sessions[session_key]
                session["container"].stop()
                del user_sessions[session_key]
            except:
                pass


# Start a background task to clean up inactive sessions
@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_inactive_sessions())


async def cleanup_inactive_sessions():
    while True:
        current_time = asyncio.get_event_loop().time()
        to_remove = []

        for session_key, session in user_sessions.items():
            # If session is inactive for more than 30 minutes
            if current_time - session["last_active"] > 1800:  # 30 minutes
                try:
                    session["container"].stop()
                    to_remove.append(session_key)
                except Exception as e:
                    print(f"Error stopping container: {str(e)}")

        # Remove stopped sessions
        for session_key in to_remove:
            del user_sessions[session_key]

        # Check every 5 minutes
        await asyncio.sleep(300)
