# Developer Quick Reference Guide

## Quick Start

### Clone & Install
```bash
git clone https://github.com/Fared49/bondos_ultra_social.git
cd bondos_ultra_social
npm install
cd server && npm install
cd ../client && npm install
```

### Environment Setup
```bash
# Create .env file in root
MONGODB_URI=mongodb://localhost:27017/bondos_ultra_social
JWT_SECRET=your_secret_key_here
BACKEND_PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Run Development
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## File Organization

### Backend Structure
```
server/src/
├── models/          # Database schemas (5 new: Room, Community, GameSession, Report, ModuleConfig)
├── controllers/     # Business logic (4 new: room, community, game, admin)
├── routes/          # API endpoints (4 new: room, community, game, admin)
├── middleware/      # Request handlers (1 new: admin)
├── config/          # Configuration files
├── utils/           # Helper functions
└── index.js         # Server entry point
```

### Frontend Structure
```
client/src/
├── pages/           # Page components (7 new: Landing, Rooms, Communities, Games, Dashboard, Settings, Admin)
├── components/      # Reusable components (enhanced Navbar)
├── hooks/           # Custom React hooks
├── store/           # Context providers
├── services/        # API communication
├── styles/          # CSS files
├── utils/           # Helper functions
├── App.jsx          # Main app component (updated)
└── main.jsx         # Entry point
```

---

## Key Models & Schemas

### Room Model
```javascript
{
  name: String,              // Room name
  description: String,       // Room description
  creator: ObjectId,         // User who created room
  members: [ObjectId],       // Array of user IDs
  moderators: [ObjectId],    // Room moderators
  isPrivate: Boolean,        // Private/Public flag
  maxMembers: Number,        // Member limit
  enabledModules: {          // Module toggles
    games: Boolean,
    chat: Boolean,
    voice: Boolean,
    mediaShare: Boolean,
    polls: Boolean
  },
  activityLog: [{}],         // Activity tracking
  joinRequests: [{}],        // Pending requests
  tags: [String],            // Room tags
  createdAt: Date,
  updatedAt: Date
}
```

### Community Model
```javascript
{
  name: String,              // Unique community name
  description: String,       // Community description
  creator: ObjectId,         // Creator user ID
  members: [ObjectId],       // Member array
  category: String,          // Category enum
  tags: [String],            // Tags
  totalMembers: Number,      // Member count
  totalPosts: Number,        // Post count
  totalViews: Number,        // View count
  createdAt: Date,
  updatedAt: Date
}
```

### GameSession Model
```javascript
{
  gameType: String,          // Game type enum
  roomId: ObjectId,          // Associated room
  players: [{                // Player array
    userId: ObjectId,
    username: String,
    score: Number,
    isReady: Boolean,
    position: Number
  }],
  gameState: Mixed,          // Game-specific state
  status: String,            // Game status enum
  winner: ObjectId,          // Winner user ID
  scoreBoard: [{}],          // Final scores
  startedAt: Date,
  endedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Common API Patterns

### Success Response
```javascript
// Single item
{
  message: "Room created successfully",
  room: { /* room data */ }
}

// List with pagination
{
  rooms: [/* room array */],
  total: 100,
  pages: 10,
  currentPage: 1
}
```

### Error Response
```javascript
{
  error: "Room not found",
  status: 404
}
```

---

## Controller Functions Cheatsheet

### Room Controller
```javascript
createRoom()              // POST /api/rooms
getRooms()               // GET /api/rooms
getRoomById()            // GET /api/rooms/:roomId
joinRoom()               // POST /api/rooms/:roomId/join
leaveRoom()              // POST /api/rooms/:roomId/leave
updateRoom()             // PUT /api/rooms/:roomId
deleteRoom()             // DELETE /api/rooms/:roomId
approveMemberRequest()   // POST /api/rooms/:roomId/approve-request/:requestId
```

### Community Controller
```javascript
createCommunity()        // POST /api/communities
getCommunities()         // GET /api/communities
getCommunityById()       // GET /api/communities/:communityId
joinCommunity()          // POST /api/communities/:communityId/join
leaveCommunity()         // POST /api/communities/:communityId/leave
updateCommunity()        // PUT /api/communities/:communityId
getTrendingCommunities() // GET /api/communities/trending
```

### Game Controller
```javascript
startGameSession()       // POST /api/games/session
getGameSession()         // GET /api/games/session/:sessionId
updateGameState()        // PUT /api/games/session/:sessionId/state
finishGameSession()      // PUT /api/games/session/:sessionId/finish
getGameSessions()        // GET /api/games
```

### Admin Controller
```javascript
// User management
getAllUsers()            // GET /api/admin/users
banUser()                // POST /api/admin/users/:userId/ban
promoteUserToMod()       // POST /api/admin/users/:userId/promote-mod
promoteUserToAdmin()     // POST /api/admin/users/:userId/promote-admin

// Room management
getAllRooms()            // GET /api/admin/rooms
deleteRoomAdmin()        // DELETE /api/admin/rooms/:roomId

// Community management
getAllCommunities()      // GET /api/admin/communities
deleteCommunityAdmin()   // DELETE /api/admin/communities/:communityId

// Reports
getReports()             // GET /api/admin/reports
resolveReport()          // PUT /api/admin/reports/:reportId/resolve

// Module config
getModuleConfig()        // GET /api/admin/modules
updateModuleConfig()     // PUT /api/admin/modules

// System
getSystemStats()         // GET /api/admin/stats
```

---

## Frontend Pages Reference

### Public Routes
- `/` - LandingPage - Public landing page

### Auth Routes
- `/login` - LoginPage - User login
- `/register` - RegisterPage - User registration

### Protected Routes
- `/feed` - FeedPage - Main feed
- `/rooms` - RoomsPage - Rooms listing & management
- `/communities` - CommunitiesPage - Communities listing
- `/games` - GamesPage - Games selection
- `/dashboard` - DashboardPage - User dashboard
- `/settings` - SettingsPage - User settings
- `/admin` - AdminPanel - Admin management (admin only)
- `/profile/:userId` - ProfilePage - User profile

---

## Common Tasks

### Add New Route
```javascript
// 1. Create in controller
export const myFunction = async (req, res) => { /* ... */ }

// 2. Add to routes file
router.post('/path', authMiddleware, myFunction);

// 3. Import in index.js
import myRoutes from './routes/myRoutes.js';

// 4. Register route
app.use('/api/my', myRoutes);
```

### Add New Page
```javascript
// 1. Create in client/src/pages/MyPage.jsx
export default function MyPage() { /* ... */ }

// 2. Import in App.jsx
import MyPage from './pages/MyPage';

// 3. Add route
<Route path="/my-page" element={<PrivateRoute><MyPage /></PrivateRoute>} />

// 4. Add to Navbar
<Link to="/my-page">My Page</Link>
```

### Add New Field to Model
```javascript
// 1. Edit model schema
userSchema.add({
  newField: {
    type: String,
    default: 'default_value'
  }
});

// 2. Update controller to use new field
const user = await User.findByIdAndUpdate(userId, { newField: value });

// 3. Update frontend to display/edit
<input value={user.newField} onChange={...} />
```

---

## Authentication Flow

```javascript
// 1. User registers
POST /api/auth/register { email, password, username }

// 2. User logs in
POST /api/auth/login { email, password }
// Returns: { token, user }

// 3. Store token in localStorage
localStorage.setItem('token', token);

// 4. Include in requests
headers: { Authorization: `Bearer ${token}` }

// 5. Server verifies with authMiddleware
// Extracts user from token and adds to req.user
```

---

## Game Development Example

### Starting a Game
```javascript
// Frontend
const startGame = async (roomId, gameType, players) => {
  const { data } = await axios.post('/api/games/session', 
    { roomId, gameType, players },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setGameSession(data.gameSession);
};
```

### Updating Game State
```javascript
// Server receives move
socket.on('game:move', (data) => {
  // Update game state
  const updatedState = processMove(gameState, data.move);
  
  // Broadcast to all players
  io.to(roomId).emit('game:state', updatedState);
});
```

### Finishing Game
```javascript
// Calculate scores and finish
const finishGame = async (sessionId, scores) => {
  const { data } = await axios.put(
    `/api/games/session/${sessionId}/finish`,
    { winner: winnerId, scoreBoard: scores },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  displayResults(data.gameSession);
};
```

---

## Admin Operations

### Ban a User
```javascript
POST /api/admin/users/{userId}/ban
Headers: Authorization: Bearer {token}
Body: { reason: "string" }
```

### Delete a Room
```javascript
DELETE /api/admin/rooms/{roomId}
Headers: Authorization: Bearer {token}
```

### Resolve Report
```javascript
PUT /api/admin/reports/{reportId}/resolve
Headers: Authorization: Bearer {token}
Body: { 
  adminNotes: "string",
  action: "warning|suspend|ban|delete"
}
```

---

## Testing Commands

```bash
# Test backend
cd server
npm run test

# Build frontend
cd ../client
npm run build

# Production build
npm run preview
```

---

## Useful Git Commands

```bash
# View changes
git diff

# Commit
git commit -m "feat: description"

# Push
git push origin main

# View log
git log --oneline

# Revert last commit
git reset --soft HEAD~1
```

---

## Common Issues & Fixes

### MongoDB Connection Failed
```
Solution: Ensure MongoDB is running
  - Linux: mongod
  - Check URI in .env
  - Check connection string format
```

### CORS Error
```
Solution: Check CORS_ORIGIN in .env
  - Frontend URL: http://localhost:5173
  - Backend URL: http://localhost:5000
  - Update CORS_ORIGIN in .env
```

### Token Expired
```
Solution: User needs to login again
  - Clear localStorage
  - Redirect to login
  - Refresh page
```

### Module Not Found
```
Solution: Check imports
  - Ensure file path is correct
  - Check .js extension
  - Verify file exists
```

---

## Performance Tips

- Use pagination for large lists
- Add database indexes for frequent queries
- Lazy load components
- Compress images
- Minimize bundle size
- Use caching headers

---

## Documentation References

- **COMPLETE_UPGRADE_GUIDE.md** - Full feature documentation
- **FEATURES_AND_SYSTEMS.md** - Technical specifications
- **TRANSFORMATION_SUMMARY.md** - Project overview

---

**Last Updated**: December 2024  
**Version**: 2.0.0
