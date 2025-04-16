#!/bin/bash
set -e

echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

echo "Starting the FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --reload