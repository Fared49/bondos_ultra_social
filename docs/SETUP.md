# Setup Guide

## System Requirements

- Node.js 18+
- npm 9+
- MongoDB 6+ (local or Docker)
- Redis (local or Docker)

## Step 1: Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Variables

```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bondos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
PORT=5000
```

## Step 2: Database Setup

### Using Docker (Recommended)

```bash
docker-compose up -d mongodb redis
```

### Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
mongod
```

## Step 3: Install Dependencies

```bash
# Install all dependencies
bash scripts/install.sh

# Or manually
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Step 4: Run Development Servers

```bash
bash scripts/dev.sh
```

This starts:
- Backend at http://localhost:5000
- Frontend at http://localhost:5173

### Manual Startup

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

## Step 5: Test the Application

### Register a new account
1. Navigate to http://localhost:5173/register
2. Create username, email, password
3. Log in with credentials

### Create a room
1. From feed, click "Create Room"
2. Enter room name and description
3. Choose privacy level

### Play games
1. Join a room
2. Select a game type
3. Invite friends to play

## Production Deployment

### Build

```bash
bash scripts/build.sh
```

### Docker Deployment

```bash
# Build and run with docker-compose
bash scripts/start.sh

# Services will be available at:
# Frontend: http://localhost (port 80)
# Backend API: http://localhost/api
# MongoDB: localhost:27017
# Redis: localhost:6379
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh
# If not, start it
brew services start mongodb-community  # macOS
```

### Redis Connection Error
```bash
# Start Redis
redis-server

# Or check if it's running
redis-cli ping
```

## API Testing

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Room
curl -X POST http://localhost:5000/api/rooms/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Room","description":"Test","privacy":"public"}'
```
