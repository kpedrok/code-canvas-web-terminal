import os

# Determine if we're running locally or on fly.io
is_production = os.environ.get("FLY_APP_NAME") is not None

# Set data directory based on environment
if is_production:
    # Use fly.io volume mount in production
    DATA_DIR = "/data/users"
else:
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
