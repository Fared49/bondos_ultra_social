# Bondos Ultra Social - Complete Full-Stack Setup

## Project Architecture

```
bondos_ultra_social/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── store/          # Context API stores
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Server entry point
│   └── package.json
│
├── docker/                 # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── nginx.conf
│   └── .dockerignore
│
├── scripts/                # Automation scripts
│   ├── install.sh         # Install dependencies
│   ├── dev.sh             # Development servers
│   ├── build.sh           # Build applications
│   └── start.sh           # Production start
│
├── docker-compose.yml     # Full stack orchestration
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # Root workspace
└── README.md             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional)
- MongoDB (local or Atlas)

### 1. Installation

```bash
# Clone and navigate
git clone <repo-url>
cd bondos_ultra_social

# Run installation
chmod +x scripts/install.sh
./scripts/install.sh

# Copy and configure environment
cp .env.example .env
# Edit .env with your settings
```

### 2. Development Mode

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api/health
```

### 3. Production Build

```bash
chmod +x scripts/build.sh
./scripts/build.sh

chmod +x scripts/start.sh
./scripts/start.sh
```

### 4. Docker Deployment

```bash
# Start full stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📋 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (lightning fast)
- **React Router** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** - Security headers

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Reverse proxy

## 🔐 Authentication Flow

1. User registers/logs in
2. Server validates credentials
3. Access token (15m) + Refresh token (7d) issued
4. Client stores tokens in localStorage
5. API requests include `Authorization: Bearer <token>`
6. Auto-refresh on 403 response
7. Logout clears tokens

## 📚 API Endpoints

### Auth Routes
```
POST   /api/auth/register      - Register user
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/logout        - Logout user
```

### User Routes
```
GET    /api/users/:id          - Get user profile
PUT    /api/users/:id          - Update profile
POST   /api/users/:id/follow   - Follow user
POST   /api/users/:id/unfollow - Unfollow user
GET    /api/users/search       - Search users
```

### Posts Routes
```
GET    /api/posts              - Get all posts (with filters)
POST   /api/posts              - Create post
GET    /api/posts/:id          - Get post details
PUT    /api/posts/:id          - Update post
DELETE /api/posts/:id          - Delete post
POST   /api/posts/:id/like     - Like post
POST   /api/posts/:id/unlike   - Unlike post
POST   /api/posts/:id/comments - Add comment
GET    /api/posts/user/:userId - Get user posts
```

### Theme Routes
```
GET    /api/themes             - Get available themes
POST   /api/themes             - Create theme
GET    /api/themes/user/:id    - Get user theme
PUT    /api/themes/user/:id    - Set user theme
```

## 🎨 Features

### Authentication
- ✅ JWT-based (access + refresh tokens)
- ✅ Secure password hashing (bcryptjs)
- ✅ Auto token refresh
- ✅ Session management

### User System
- ✅ Registration & login
- ✅ Profile management
- ✅ Follow/unfollow
- ✅ User search
- ✅ Avatar & bio

### Posts System
- ✅ Create/read/update/delete posts
- ✅ Multiple image uploads
- ✅ Like/unlike posts
- ✅ Comments
- ✅ Categories & tags
- ✅ Search & filters

### Theme System
- ✅ Dark/light mode toggle
- ✅ Custom color themes
- ✅ Persistent theme storage
- ✅ Per-user theme settings

### Production Features
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Error handling
- ✅ Request logging
- ✅ Database indexing
- ✅ File upload handling

## 🔧 Environment Variables

See `.env.example` for all variables:

```bash
# Backend
BACKEND_PORT=5000
MONGODB_URI=mongodb://localhost:27017/bondos_ultra_social

# JWT
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_secret_key

# Frontend
VITE_API_URL=http://localhost:5000/api

# Security
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=5242880
```

## 📦 Project Commands

```bash
# Installation
npm run install              # Install all dependencies

# Development
npm run dev                  # Start dev servers
npm run build                # Build for production
npm run start                # Start production servers

# Docker
npm run docker:up            # Start full stack (Docker)
npm run docker:down          # Stop containers
npm run docker:logs          # View Docker logs
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend (5173)
lsof -i :5173
kill -9 <PID>

# Backend (5000)
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

### Dependencies Issues
```bash
# Clear caches and reinstall
rm -rf node_modules client/node_modules server/node_modules
rm -rf package-lock.json client/package-lock.json server/package-lock.json
./scripts/install.sh
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push: `git push origin feature/amazing-feature`
4. Open PR

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Support

For issues or questions:
1. Check existing issues
2. Read documentation
3. Create detailed issue report
4. Include error logs and steps to reproduce

---

**Happy Coding! 🚀**

Built with ❤️ by Bondos Ultra Social Team
