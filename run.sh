#!/bin/bash

# Get the absolute path of the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Running from directory: $SCRIPT_DIR"

# Create persistent data directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/persistent_data/users"
chmod -R 777 "$SCRIPT_DIR/persistent_data"

# Export HOST_DATA_DIR for docker-compose
export HOST_DATA_DIR="$SCRIPT_DIR/persistent_data/users"
echo "Setting HOST_DATA_DIR=$HOST_DATA_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose > /dev/null 2>&1; then
  echo "docker-compose is not installed. Please install docker-compose and try again."
  exit 1
fi

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose down -v > /dev/null 2>&1

# Start the containers
echo "Starting web-terminal services..."
docker-compose up -d

echo ""
echo "✅ Web Terminal is now running!"
echo "   - Backend API: http://localhost:8000"
echo "   - Web Interface: http://localhost:8080"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To view frontend logs: docker-compose logs -f frontend"
echo "To view backend logs: docker-compose logs -f backend"
echo "To stop: docker-compose down"
echo "" 