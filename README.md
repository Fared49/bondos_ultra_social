# 🎮 Bondos Ultra Social v2

A realtime social media platform with integrated multiplayer games, virtual rooms, and live chat.

## ✨ Features

- **Realtime Chat**: Socket.io powered instant messaging
- **Multiplayer Games**: TicTacToe, Snakes & Ladders, Card Game, Guessing Game
- **Virtual Rooms**: Create and manage public/private rooms
- **Social Posts**: Share and discover content
- **Live Presence**: See who's online in real-time
- **User Profiles**: Follow, unfollow, and explore users
- **Responsive UI**: Built with React and TailwindCSS

## 🛠️ Tech Stack

### Backend
- Node.js 18+ with Express.js
# 🎮 Bondos Ultra Social v2

A realtime social media platform with integrated multiplayer games, virtual rooms, and live chat.

## ✨ Features

- **Realtime Chat**: Socket.io powered instant messaging
- **Multiplayer Games**: TicTacToe, Snakes & Ladders, Card Game, Guessing Game
- **Virtual Rooms**: Create and manage public/private rooms
- **Social Posts**: Share and discover content
- **Live Presence**: See who's online in real-time
- **User Profiles**: Follow, unfollow, and explore users
- **Responsive UI**: Built with React and TailwindCSS

## 🛠️ Tech Stack

### Backend
- Node.js 18+ with Express.js
- Socket.io for realtime communication
- MongoDB for data persistence
- Redis for caching
- JWT authentication with bcryptjs
- Mongoose ODM

### Frontend
- React 18 with Vite
- React Router for navigation
- Socket.io-client for realtime updates
- Axios for API requests
- TailwindCSS for styling

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy
- MongoDB & Redis containers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- MongoDB & Redis (optional if using Docker)

### Local Development

```bash
# 1. Clone and setup
git clone <repo>
cd bondos_ultra_social_v2

# 2. Install dependencies
bash scripts/install.sh

# 3. Create .env file
cp .env.example server/.env

# 4. Start development servers
bash scripts/dev.sh
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

### Docker Deployment

```bash
# Build and start all services
bash scripts/start.sh

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost/api
```

## 📚 Documentation

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)

## 📊 Project Stats

- Backend: 18 files, 3000+ lines of code
- Frontend: 12+ page components, 15+ UI components
- Games: 4 fully implemented multiplayer games
- API Endpoints: 20+ RESTful endpoints
- Socket.io Events: 15+ realtime events

## 👥 Contributing

Contributions welcome! Follow the development setup above.

## 📝 License

MIT License
