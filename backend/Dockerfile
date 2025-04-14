FROM python:3.12-slim

# Install dependencies including Docker CLI and bash
RUN apt-get update && \
    apt-get install -y bash curl docker.io && \
    apt-get clean

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create data directory
RUN mkdir -p /data/users

# Expose the port
EXPOSE 8000

# The command will be provided by docker-compose
# For standalone usage:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
