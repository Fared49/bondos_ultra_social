#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting production servers...${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    exit 1
fi

# Check if frontend is built
if [ ! -d client/dist ]; then
    echo -e "${YELLOW}Frontend not built. Building...${NC}"
    ./scripts/build.sh
fi

# Start backend
echo -e "${YELLOW}Starting backend on port 5000...${NC}"
cd server
NODE_ENV=production npm start &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
echo -e "${YELLOW}API: ${GREEN}http://localhost:5000/api${NC}"
echo ""
echo -e "${YELLOW}To stop: kill $BACKEND_PID${NC}"

wait
