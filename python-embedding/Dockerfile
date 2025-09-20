FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y git build-essential

# Install Python dependencies
COPY requirements.txt .
RUN pip install  -U pip
RUN pip install  -r requirements.txt

# Copy app code (for initial build)
COPY . .

EXPOSE 8000

# Use --reload so code changes auto-reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Use gunicorn for production
# CMD ["gunicorn", "-w", "2", "-k", "uvicorn.workers.UvicornWorker", "main:app", "-b", "0.0.0.0:8000"]

