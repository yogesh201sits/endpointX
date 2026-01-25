#!/bin/bash

# This script runs during building the sandbox template
# It makes sure the backend server starts and responds

BACKEND_DIR="/home/user/backend-app"
PORT=3000

# Function to ping the server until it's up
function ping_server() {
    counter=0
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}")
    while [[ ${response} -ne 200 ]]; do
        let counter++
        if (( counter % 20 == 0 )); then
            echo "Waiting for backend to start..."
            sleep 0.1
        fi
        response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}")
    done
}

# Run backend server in the background
cd $BACKEND_DIR

# If package.json has a "dev" script, use it; otherwise fallback to node index.js
if npm run | grep -q "dev"; then
    npm run dev &
else
    node index.js &
fi

# Ping until server is ready
ping_server

echo "Backend server is up and running on port ${PORT}."
