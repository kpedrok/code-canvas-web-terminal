from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
import asyncio
from ..core.docker import get_session, execute_command, stop_session
from ..db.database import get_db
from ..db.repository import UserRepository, ProjectRepository
from sqlalchemy.orm import Session
import os
from jose import JWTError, jwt
from ..core.auth import SECRET_KEY, ALGORITHM

router = APIRouter()


@router.websocket("/ws/{user_id}/{project_id}")
async def terminal_ws(
    websocket: WebSocket, 
    user_id: str, 
    project_id: str, 
    token: str = Query(None),
    db: Session = Depends(get_db)
):
    await websocket.accept()

    try:
        # Verify the authentication token if provided
        if token:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                token_user_id = payload.get("sub")
                if token_user_id != user_id:
                    await websocket.send_text("Authentication error: Token user ID doesn't match path user ID\n")
                    await websocket.close()
                    return
            except JWTError:
                await websocket.send_text("Authentication error: Invalid token\n")
                await websocket.close()
                return
        else:
            # For development, we'll still allow connections without a token
            # but display a warning. In production, you would want to enforce tokens.
            await websocket.send_text("Warning: No authentication token provided. This will be required in production.\n")

        # Send a welcome message to confirm connection
        await websocket.send_text("Connected to terminal. Checking project access...\n")

        # Validate that the user and project exist in the database
        user = UserRepository.get_user(db, user_id)
        if not user:
            await websocket.send_text("Error: User not found\n")
            await websocket.close()
            return

        # Check if the project exists for this user
        project = ProjectRepository.get_project(db, project_id)
        if not project:
            # For POC purposes, we'll create a default project if it doesn't exist
            project = ProjectRepository.create_project(
                db,
                name=f"Project {project_id[:8]}",
                user_id=user_id,
                description="Auto-created project",
            )
            await websocket.send_text(f"Created new project: {project.name}\n")
        elif project.user_id != user_id:
            # Check project ownership
            await websocket.send_text("Error: You don't have access to this project\n")
            await websocket.close()
            return

        await websocket.send_text("Starting container...\n")

        # Get or create session
        session = get_session(user_id, project_id)
        container = session["container"]

        # Update last active timestamp
        session["last_active"] = asyncio.get_event_loop().time()

        # Send initial container info and prompt
        await websocket.send_text(
            "Web Terminal ready. Type commands and press Enter. Your files are stored in /workspace\n"
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
                    # Execute the command
                    exit_code, (stdout, stderr) = execute_command(container, cmd)

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
        stop_session(user_id, project_id)

    except Exception as e:
        # Handle other exceptions
        try:
            await websocket.send_text(f"Error: {str(e)}\n")
        except:
            pass

        # Clean up
        stop_session(user_id, project_id)
