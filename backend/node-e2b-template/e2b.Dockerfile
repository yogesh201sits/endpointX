# Use Node.js 21 slim as base
FROM node:21-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    unzip \
    wget \
    ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy optional setup scripts
COPY compile_backend.sh /compile_backend.sh
RUN chmod +x /compile_backend.sh

# Set working directory for generated projects
WORKDIR /home/user/backend-app

# Initialize a basic Node.js project (JavaScript only)
RUN npm init -y

# Install nodemon for dev convenience
RUN npm install --save-dev nodemon

# Expose default backend port
EXPOSE 3000

# Default command
CMD ["bash"]
