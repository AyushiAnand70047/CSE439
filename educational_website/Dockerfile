FROM python:3.9-slim

WORKDIR /app

# Install necessary build tools
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]