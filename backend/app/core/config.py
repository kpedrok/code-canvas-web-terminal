import os

# Use local directory for development
DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "persistent_data/users",
)

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Session timeout in seconds (30 minutes)
SESSION_TIMEOUT = 1800

# Cleanup check interval in seconds (5 minutes)
CLEANUP_INTERVAL = 300
