from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import docker
import asyncio
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow connections from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

docker_client = docker.from_env()
user_sessions = {}


@app.get("/")
def read_root():
    return {"message": "Web Terminal API is running"}


@app.websocket("/ws/{user_id}")
async def terminal_ws(websocket: WebSocket, user_id: str):
    await websocket.accept()

    try:
        # Send a welcome message to confirm connection
        await websocket.send_text("Connected to terminal. Starting container...\n")

        # Create or get user session
        if user_id not in user_sessions:
            # Create a new Docker container for this session
            container = docker_client.containers.run(
                "python:3.12-slim",
                command="bash",
                stdin_open=True,
                tty=True,
                detach=True,
                remove=True,  # Auto-remove when stopped
            )

            # Store session info
            user_sessions[user_id] = {
                "container": container,
                "container_id": container.id,
            }

            await websocket.send_text(
                f"Container started with ID: {container.id[:12]}\n"
            )

        session = user_sessions[user_id]
        container = session["container"]

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
            "echo 'Web Terminal ready. Type commands and press Enter.'"
        )
        await websocket.send_text("\n$ ")

        # Process commands from the client
        while True:
            cmd = await websocket.receive_text()
            if cmd.strip().lower() in ["exit", "quit"]:
                await websocket.send_text("Closing session...\n")
                break

            if cmd.strip():
                # Execute the command and stream output
                exec_result = container.exec_run(f"/bin/bash -c '{cmd}'", stream=True)

                for chunk in exec_result.output:
                    if chunk:
                        await websocket.send_text(
                            chunk.decode("utf-8", errors="ignore")
                        )

                # Send a new prompt
                await websocket.send_text("\n$ ")

    except WebSocketDisconnect:
        # Clean up resources
        if user_id in user_sessions:
            try:
                session = user_sessions[user_id]
                session["container"].stop()
                del user_sessions[user_id]
            except Exception as e:
                print(f"Error cleaning up: {str(e)}")

    except Exception as e:
        # Handle other exceptions
        try:
            await websocket.send_text(f"Error: {str(e)}\n")
        except:
            pass

        # Clean up
        if user_id in user_sessions:
            try:
                session = user_sessions[user_id]
                session["container"].stop()
                del user_sessions[user_id]
            except:
                pass
