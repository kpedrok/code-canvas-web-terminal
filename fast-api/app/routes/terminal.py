from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
from ..core.docker import get_session, execute_command, stop_session

router = APIRouter()


@router.websocket("/ws/{user_id}/{project_id}")
async def terminal_ws(websocket: WebSocket, user_id: str, project_id: str):
    await websocket.accept()

    try:
        # Send a welcome message to confirm connection
        await websocket.send_text("Connected to terminal. Starting container...\n")

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
