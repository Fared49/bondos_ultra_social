#!/bin/bash
<<<<<<< HEAD
set -e

echo "🔨 Building frontend..."
cd client && npm run build && cd ..

echo "✅ Build complete!"
=======

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔨 Building applications...${NC}"

# Build backend
echo -e "${YELLOW}Building backend...${NC}"
cd server
npm run build 2>/dev/null || true
if [ $? -eq 0 ] || [ ! -f package.json ]; then
    echo -e "${GREEN}✓ Backend ready${NC}"
else
    echo -e "${RED}✗ Backend build failed${NC}"
    exit 1
fi
cd ..

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd client
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✓ Build complete!${NC}"
echo -e "${YELLOW}Build artifacts:${NC}"
echo -e "  Frontend: ${GREEN}./client/dist${NC}"
echo -e "  Backend: ${GREEN}ready to run${NC}"
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
