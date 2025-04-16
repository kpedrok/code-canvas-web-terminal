# Web Terminal - Browser-Based Terminal Environment

This project provides a browser-based terminal environment where each user gets an isolated Docker container per project. Users can execute shell commands like `pip install`, `python script.py`, etc., with persistent storage.

## 🎬 Demo Preview

A demo video is included in this repository. You can watch it to see the Web Terminal in action:

```bash
# For macOS
open demo-preview.mov

# For Windows
start demo-preview.mov

# For Linux with a video player like VLC
vlc demo-preview.mov
```

## ⚠️ IMPORTANT: DEMO USE ONLY

**This is a demonstration project intended for learning purposes only and is NOT production-ready.**

The following security limitations exist:

- Frontend authentication uses localStorage (insecure for production)
- CORS settings are wide open (configured for development only)
- Docker containers run without proper resource limits
- No proper user authentication or authorization system

## 🌟 Features

- WebSocket communication between terminal UI and backend
- One Docker container per user per project
- Real-time terminal output streaming
- Persistent file storage per project
- Full-featured React frontend with code editor
- SQLite database for project management
- Docker-based development environment

## 🏗️ Project Structure

```
web-terminal-3/
├── backend/             # FastAPI backend that creates and manages containers
│   ├── main.py          # Main FastAPI application
│   ├── app/             # Core application logic
│   │   ├── core/        # Configuration and Docker management
│   │   ├── db/          # Database models and repository
│   │   ├── routes/      # API endpoints
│   │   ├── schemas/     # Pydantic schemas
│   │   └── utils/       # Helper utilities
│   ├── web_terminal.db  # SQLite database
│   ├── Dockerfile       # Backend container definition
│   └── requirements.txt # Python dependencies
├── web/                 # React frontend
│   ├── src/             # React source code
│   │   ├── components/  # UI components including Terminal
│   │   ├── lib/         # Store management and utilities
│   │   └── pages/       # Application pages
│   ├── package.json     # Node.js dependencies
│   └── Dockerfile       # Frontend container definition
├── persistent_data/     # Persistent storage for user files
├── test.html            # Simple HTML terminal client
├── docker-compose.yml   # Docker composition for development
└── run.sh               # Helper script to run the project
```

## 🚀 Quick Start (Easiest Method)

Simply run the provided shell script:

```bash
# Make sure the script is executable
chmod +x run.sh

# Run the project
./run.sh
```

Access the web terminal at http://localhost:8080

## 🐳 Manual Setup with Docker Compose

You can also use Docker Compose directly:

```bash
# Create persistent data directory
mkdir -p persistent_data/users

# Set environment variable for host data directory
export HOST_DATA_DIR="$(pwd)/persistent_data/users"

# Start the application
docker-compose up
```

The backend will be available at http://localhost:8000 and the web interface at http://localhost:8080.

## 🔄 Switching Frontend Options

The project supports two frontend options:

### 1. Simple HTML Terminal (test.html)

A basic HTML/JavaScript terminal interface with minimal dependencies. To use this frontend:

1. Edit `docker-compose.yml` to use the nginx-based frontend (uncomment the simple frontend section and comment out the complex frontend)
2. Restart the containers: `docker-compose down && docker-compose up -d`

### 2. Full-Featured React Frontend (web/)

A full-featured React application with modern UI components including:
- Terminal emulator with command history
- File browser for project files
- Monaco-based code editor
- Project management dashboard

This is enabled by default in the docker-compose.yml file.

## 🛠️ Development Workflow

### Viewing Logs

```bash
# View all logs
docker-compose logs -f

# View only backend logs
docker-compose logs -f backend

# View only frontend logs
docker-compose logs -f frontend
```

### Rebuilding Containers

If you make changes to the Dockerfiles or dependencies:

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Accessing a Running Container

```bash
# Access the backend container
docker-compose exec backend bash

# Access the frontend container
docker-compose exec frontend sh
```

## 📝 Manual Setup (Without Docker)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup

For the simple HTML frontend:

- Open `test.html` in a browser
- Enter a project ID and click "Connect"

For the React frontend:

```bash
cd web
pnpm install  # or npm install
pnpm run dev  # or npm run dev
```

## 🗄️ Database Management

The project uses SQLite for persistence. The database file is located at `backend/web_terminal.db`.

- Database migrations run automatically on startup
- You can back up the database by copying the `web_terminal.db` file
- To reset the database, delete the file and restart the application

## 🐳 Building a Custom Terminal Environment

You can customize the Docker image used for the terminal sessions:

```bash
cd backend
docker build -t custom_terminal_env -f Dockerfile.terminal .
```

Then modify `app/core/docker.py` to use your custom image instead of the default.

## ⚠️ Security Notes

- Do NOT run this in production without significant security improvements including:
  - Proper authentication and authorization
  - Container resource limits and sandboxing
  - Restricted CORS settings
  - Secure password handling
  - Rate limiting and request validation
  - TLS/HTTPS for all connections
- Always clean up old sessions and containers to prevent resource leaks
- This project is vulnerable to various security issues if deployed as-is

## 🔧 Troubleshooting

### Docker Mount Issues

If you see errors about mounts being denied:

- Ensure the `HOST_DATA_DIR` environment variable is set correctly
- Verify that Docker has permission to access the directories being mounted
- On macOS/Windows, add the project directory to Docker Desktop's File Sharing preferences
- On Windows with WSL, ensure you're running from the WSL filesystem

### Connection Issues

If the terminal fails to connect:

- Check that both backend and frontend containers are running
- Verify the WebSocket connection in your browser's dev tools
- Ensure your browser can access the backend on port 8000

## 🔮 Future Improvements

The following improvements are planned for future releases:

1. **Enhanced Security**
   - Implement JWT token refresh mechanism
   - Set up container resource limits
   - Add env.example variables

3. **Backend Optimizations**
   - Migrate from SQLite to PostgreSQL for better scalability
   - Deploy to cloud

4. **Developer Experience**
   - Improve test coverage
   - Set up CI/CD pipeline

