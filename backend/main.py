"""
Entry point for the Web Terminal API application.
This file imports the FastAPI application from app/main.py and runs it with uvicorn.
"""

import uvicorn
from app.main import app  # Import the app object from app.main

# Run the application directly when this file is executed
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
