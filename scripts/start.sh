#!/bin/bash

echo "🐳 Starting with Docker Compose..."
docker-compose up -d

echo "✅ Services started!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "MongoDB: localhost:27017"
echo "Redis: localhost:6379"
