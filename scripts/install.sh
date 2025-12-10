#!/bin/bash
<<<<<<< HEAD
set -e

echo "🚀 Installing dependencies..."
cd server && npm install && cd ..
cd client && npm install && cd ..

echo "✅ Installation complete!"
=======

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Installing Bondos Ultra Social...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
fi

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✓ Installation complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Update .env with your configuration"
echo -e "  2. Start MongoDB (local or Docker)"
echo -e "  3. Run: ${GREEN}./scripts/dev.sh${NC} (for development)"
echo -e "  4. Or run: ${GREEN}docker-compose up${NC} (for Docker)"
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
