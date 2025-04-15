import asyncio

from ..core.config import CLEANUP_INTERVAL, SESSION_TIMEOUT
from ..core.docker import user_sessions


async def cleanup_inactive_sessions():
    """Background task to clean up inactive sessions."""
    while True:
        current_time = asyncio.get_event_loop().time()
        to_remove = []

        for session_key, session in user_sessions.items():
            # If session is inactive for more than the timeout period
            if current_time - session["last_active"] > SESSION_TIMEOUT:
                try:
                    session["container"].stop()
                    to_remove.append(session_key)
                except Exception as e:
                    print(f"Error stopping container: {str(e)}")

        # Remove stopped sessions
        for session_key in to_remove:
            del user_sessions[session_key]

        # Wait for the next cleanup interval
        await asyncio.sleep(CLEANUP_INTERVAL)
