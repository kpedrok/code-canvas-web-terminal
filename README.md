# Web Terminal Backend (FastAPI + Docker)

This project runs a Linux-like terminal in the browser. Each user gets an isolated Docker container where they can execute shell commands like `pip install`, `python script.py`, etc.

## ✅ Features

- WebSocket communication between terminal UI and backend
- One Docker container per user
- Real-time terminal output

## 🚀 Run Locally

Deactivate all virtual environment instances:

deactivate
python -m venv venv

### 1. Install dependencies

```bash
deactivate
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Run the server

```bash
uvicorn main:app --reload
```

### 3. Open the demo

Open `test.html` in a browser.

## 🐳 Build your custom image (optional)

```bash
docker build -t user_env .
```

Then replace `"python:3.12-slim"` with `"user_env"` in `main.py`.

## ⚠️ Security Notes

- Do NOT run this in production without container resource limits and sandboxing.
- Always clean up old sessions and containers.
