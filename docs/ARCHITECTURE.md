# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Pages: Landing, Auth, Feed, Profile, Rooms, Games  │    │
│  │ Components: Chat, GameBoard, RoomCard, etc         │    │
│  │ State: AuthContext, SocketContext                  │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP + WebSocket (Socket.io)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Server (Express + Socket.io)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Routes: /api/auth, /api/rooms, /api/posts         │    │
│  │ Controllers: userController, roomController, etc   │    │
│  │ Services: userService, roomService                │    │
│  │ Games: TicTacToe, Snakes, Cards, Guessing         │    │
│  │ Socket.io Events: chat, games, presence, rooms    │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼─────┐  ┌────▼──────┐  ┌────▼──────┐
   │ MongoDB  │  │   Redis   │  │  Session  │
   │ (Data)   │  │ (Cache)   │  │ (Socket)  │
   └──────────┘  └───────────┘  └───────────┘
```

## Directory Structure

```
bondos_ultra_social_v2/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Route pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Context providers
│   │   ├── services/      # API client
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── games/         # Game logic classes
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration
│   │   └── index.js       # Main server file
│   ├── tests/             # Test files
│   ├── package.json
│   └── .env
│
├── docker/                 # Docker configuration
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── nginx.conf
│
├── scripts/               # Automation scripts
│   ├── install.sh
│   ├── dev.sh
│   ├── build.sh
│   └── start.sh
│
├── docs/                  # Documentation
├── docker-compose.yml     # Container orchestration
├── .env.example           # Environment template
├── .gitignore
└── README.md
```

## Data Models

### User
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  bio: String,
  followers: [User._id],
  following: [User._id],
  blockedUsers: [User._id],
  theme: String (light/dark),
  isOnline: Boolean,
  lastSeenAt: Date,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  author: User._id,
  title: String,
  content: String,
  images: [String],
  category: String (enum),
  room: Room._id (optional),
  likes: [User._id],
  comments: [{
    author: User._id,
    text: String,
    createdAt: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Room
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: User._id,
  members: [User._id],
  privacy: String (public/private/invite),
  modules: [String] (chat, posts, games, polls),
  avatar: String,
  inviteCode: String (unique),
  games: [{
    type: String,
    state: Object,
    players: [User._id],
    startedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  sender: User._id,
  room: Room._id,
  text: String,
  type: String (text/system/game/poll),
  data: Object (game-specific),
  createdAt: Date
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/follow/:userId` - Follow user
- `GET /api/auth/search?q=` - Search users

### Rooms
- `POST /api/rooms/create` - Create room
- `GET /api/rooms` - List rooms
- `GET /api/rooms/:roomId` - Get room details
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room
- `POST /api/rooms/invite/:inviteCode` - Join by invite
- `GET /api/rooms/:roomId/messages` - Get messages
- `POST /api/rooms/:roomId/game/start` - Start game

### Posts
- `POST /api/posts/create` - Create post
- `GET /api/posts` - List posts
- `GET /api/posts/trending` - Get trending posts
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/comment` - Add comment

## Socket.io Events

### Connection
- `connection` - User connects
- `disconnect` - User disconnects
- `presence:typing` - User typing indicator
- `presence:stop` - Stop typing

### Chat
- `chat:message` - Send/receive message
- `room:join` - Join room
- `room:leave` - Leave room

### Games
- `game:start` - Initialize game
- `game:move` - Player move
- `game:end` - Game finished
- `game:state` - Game state update

## Authentication Flow

```
1. User registers with email/password
   └─> Server hashes password with bcryptjs
   └─> Stores user in MongoDB

2. User logs in
   └─> Server verifies password
   └─> Generates JWT tokens (15m access, 7d refresh)
   └─> Returns tokens to client

3. Client stores tokens in localStorage
   └─> Access token: Authorization header for API
   └─> Refresh token: Used to get new access token

4. Socket.io connection
   └─> Client sends token in handshake
   └─> Server validates token with socketAuthMiddleware
   └─> Socket joins user's room and activeUsers Map
```

## Game Flow

```
1. User initiates game start
   └─> POST /api/rooms/:roomId/game/start

2. Server creates game instance
   └─> Instantiates GameManager (TicTacToe, etc)
   └─> Stores in gameInstances Map

3. Socket.io event: game:start
   └─> Notifies all players
   └─> Sends initial game state

4. Player makes move
   └─> Emits game:move event
   └─> Server validates move in GameManager
   └─> Updates game state

5. Server checks win condition
   └─> game:end event if winner
   └─> Broadcasts to all players
   └─> Updates Room.games array

6. Game cleanup
   └─> Remove from gameInstances
   └─> Archive in Room model
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│        Nginx (Port 80)              │
│    (Reverse Proxy + Static)         │
├─────────────────────────────────────┤
│   Client (React dist)               │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│    Server (Port 5000)               │
│   Express + Socket.io               │
└─────────────────────────────────────┘
      │              │
      ▼              ▼
  MongoDB         Redis
```

## Security Considerations

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with expiration (access: 15m, refresh: 7d)
- Socket.io auth middleware validates tokens
- Game moves validated server-side
- User input sanitized before storage
- CORS configured for trusted origins
- Rate limiting on auth endpoints (recommended)
- TLS/HTTPS in production
