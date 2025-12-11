#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting development servers...${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found. Run: ./scripts/install.sh${NC}"
    exit 1
fi

# Start backend in background
echo -e "${YELLOW}Starting backend on port 5000...${NC}"
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo -e "${YELLOW}Starting frontend on port 5173...${NC}"
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✓ Servers starting...${NC}"
echo -e "${YELLOW}Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "${YELLOW}Backend: ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop servers${NC}"

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID" INT

# Wait for processes
wait
