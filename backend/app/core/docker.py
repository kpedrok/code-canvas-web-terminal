import os

import docker

from ..core.config import DATA_DIR

docker_client = docker.from_env()
user_sessions = {}


def create_container(user_id: str, project_id: str):
    """Create a new Docker container for a user session."""
    user_project_dir = os.path.join(DATA_DIR, user_id, project_id)
    os.makedirs(user_project_dir, exist_ok=True)

    # For macOS Docker Desktop, we need to map the container path to host path
    host_path = user_project_dir
    if os.environ.get("HOST_DATA_DIR"):
        # If running in Docker, map the container path to host path
        host_path = os.path.join(os.environ.get("HOST_DATA_DIR"), user_id, project_id)
        print(f"Mapping container path {user_project_dir} to host path {host_path}")

    # Ensure everyone can read/write to this directory
    try:
        os.system(f"chmod -R 777 {user_project_dir}")
    except Exception as e:
        print(f"Warning: Could not set permissions on {user_project_dir}: {str(e)}")

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
    container.exec_run("pip install numpy pandas scipy")


    return container


def get_session(user_id: str, project_id: str):
    """Get or create a session for a user/project combination."""
    session_key = f"{user_id}:{project_id}"

    if session_key not in user_sessions:
        container = create_container(user_id, project_id)
        user_sessions[session_key] = {
            "container": container,
            "container_id": container.id,
            "last_active": None,
        }

    return user_sessions[session_key]


def execute_command(container, cmd: str):
    """Execute a command in a container and return the output."""
    exec_result = container.exec_run(cmd=f"/bin/bash -c '{cmd}'", demux=True)
    return exec_result.exit_code, exec_result.output


def stop_session(user_id: str, project_id: str):
    """Stop and remove a user session."""
    session_key = f"{user_id}:{project_id}"
    if session_key in user_sessions:
        try:
            user_sessions[session_key]["container"].stop()
            del user_sessions[session_key]
        except Exception as e:
            print(f"Error stopping container: {str(e)}")
