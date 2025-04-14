# Web Terminal API

A FastAPI-based web terminal service that provides isolated terminal sessions for users and projects.

## Features

- WebSocket-based terminal sessions
- Isolated Docker containers per user/project
- Persistent storage for user files
- Automatic cleanup of inactive sessions
- Health check endpoint

## Project Structure

```
api/
├── app/                    # Main application package
│   ├── __init__.py
│   ├── main.py            # FastAPI application setup
│   ├── routes/            # API routes
│   │   ├── __init__.py
│   │   ├── terminal.py    # Terminal WebSocket endpoint
│   │   └── health.py      # Health check endpoint
│   ├── core/              # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py      # Configuration settings
│   │   └── docker.py      # Docker container management
│   └── utils/             # Utility functions
│       ├── __init__.py
│       └── cleanup.py     # Session cleanup utilities
├── persistent_data/       # User data storage
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
└── README.md             # This file
```

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the application:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Docker Deployment

Build and run the container:

```bash
docker build -t web-terminal-api .
docker run -p 8000:8000 web-terminal-api
```

## API Endpoints

- `GET /`: Root endpoint
- `GET /health`: Health check endpoint
- `WS /ws/{user_id}/{project_id}`: WebSocket terminal session

## Environment Variables

- `FLY_APP_NAME`: Set in production to use fly.io volume mounts
- `DATA_DIR`: Override the default data directory path

## Security Notes

- CORS is currently configured to allow all origins (`*`). In production, this should be restricted to specific domains.
- Each user/project combination gets an isolated Docker container.
- Sessions are automatically cleaned up after 30 minutes of inactivity.
