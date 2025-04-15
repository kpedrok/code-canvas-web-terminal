# Web Terminal Backend API

A FastAPI-based web terminal service that provides isolated terminal sessions for users and projects with SQLite database for project management.

## Features

- WebSocket-based terminal sessions
- Isolated Docker containers per user/project
- Persistent storage for user files
- Project management API with SQLite database
- Automatic cleanup of inactive sessions
- Health check endpoint

## Project Structure

```
backend/
├── main.py                 # Entry point
├── requirements.txt        # Python dependencies
├── Dockerfile              # Container configuration
├── web_terminal.db         # SQLite database
├── app/                    # Main application package
│   ├── __init__.py
│   ├── main.py             # FastAPI application setup
│   ├── core/               # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py       # Configuration settings
│   │   └── docker.py       # Docker container management
│   ├── db/                 # Database models and operations
│   │   ├── __init__.py
│   │   ├── database.py     # Database connection
│   │   ├── models.py       # SQLAlchemy models
│   │   └── repository.py   # Database operations
│   ├── routes/             # API routes
│   │   ├── __init__.py
│   │   ├── health.py       # Health check endpoint
│   │   ├── projects.py     # Project management endpoints
│   │   └── terminal.py     # Terminal WebSocket endpoint
│   ├── schemas/            # Pydantic schemas
│   │   └── projects.py     # Project data schemas
│   └── utils/              # Utility functions
│       ├── __init__.py
│       ├── cleanup.py      # Session cleanup utilities
│       └── migration.py    # Database migration utilities
└── README.md               # This file
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
docker run -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /path/to/persistent_data:/app/persistent_data \
  web-terminal-api
```

## API Endpoints

### Terminal
- `WS /ws/{user_id}/{project_id}`: WebSocket terminal session

### Projects
- `GET /projects`: List all projects
- `POST /projects`: Create a new project
- `GET /projects/{project_id}`: Get project details
- `PUT /projects/{project_id}`: Update project
- `DELETE /projects/{project_id}`: Delete project

### System
- `GET /`: Root endpoint
- `GET /health`: Health check endpoint

## Database

The application uses SQLite with SQLAlchemy ORM. The database schema includes:

- Project model for storing project information
- Automatic migrations on startup

## Environment Variables

- `FLY_APP_NAME`: Set in production to use fly.io volume mounts
- `DATA_DIR`: Override the default data directory path
- `DB_URL`: Database connection URL (defaults to SQLite)

## Security Notes

- CORS is currently configured to allow all origins (`*`). In production, this should be restricted to specific domains.
- Each user/project combination gets an isolated Docker container.
- Sessions are automatically cleaned up after inactivity.

## Development

### Running Tests

```bash
pytest
```

### Database Management

Database migrations run automatically on startup, but you can also run them manually:

```bash
python -m app.utils.migration
```

Last updated: April 15, 2025
