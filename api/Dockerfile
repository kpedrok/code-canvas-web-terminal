FROM python:3.12-slim

# Install dependencies including Docker CLI and bash
RUN apt-get update && \
    apt-get install -y bash curl docker.io && \
    apt-get clean

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
