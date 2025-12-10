# Feature Documentation

## Games System

### Game Types

#### 1. XO (Tic-Tac-Toe)
- **Players**: 2
- **Board**: 3x3 grid
- **Win Condition**: 3 in a row (horizontal, vertical, diagonal)
- **Implementation**: Array-based grid state
- **Socket Events**:
  - `game:move` - Player makes move
  - `game:update` - Board state update
  - `game:win` - Declare winner
  - `game:tie` - Game ends in tie

#### 2. Cards
- **Players**: 2-4
- **Deck**: Standard 52-card deck
- **Gameplay**: Varies by rule set
- **Socket Events**:
  - `game:deal` - Deal cards
  - `game:play` - Player plays card
  - `game:turn` - Next player's turn
  - `game:score` - Update scores

#### 3. Guess the Movie
- **Players**: 2+
- **Format**: Give clues about movie titles
- **Scoring**: Points for correct guess
- **Socket Events**:
  - `game:clue` - Send clue
  - `game:guess` - Player guesses
  - `game:points` - Award points
  - `game:nextRound` - Start next round

#### 4. Guess the Word
- **Players**: 2+
- **Format**: Guess hidden word from hints
- **Difficulty Levels**: Easy, Medium, Hard
- **Socket Events**:
  - `game:hint` - Send hint
  - `game:letter` - Guess letter
  - `game:word` - Guess full word
  - `game:reveal` - Reveal word

#### 5. Describe Me
- **Players**: 3+
- **Format**: One player describes, others guess
- **Rounds**: Multiple rounds with scoring
- **Socket Events**:
  - `game:description` - Send description
  - `game:guess` - Player guesses
  - `game:correct` - Correct guess
  - `game:rotate` - Rotate describer

#### 6. Snakes & Ladders (سلم وتعبان)
- **Players**: 2-4
- **Board**: 100 squares
- **Dice**: Roll to move
- **Special Squares**: Snakes down, Ladders up
- **Win Condition**: Reach square 100
- **Socket Events**:
  - `game:roll` - Roll dice
  - `game:move` - Move pawn
  - `game:snake` - Hit snake
  - `game:ladder` - Hit ladder
  - `game:win` - Reach end

#### 7. Memory Match
- **Players**: 1+
- **Pairs**: 8-16 pairs of cards
- **Gameplay**: Flip cards to match pairs
- **Scoring**: Fewest moves wins
- **Socket Events**:
  - `game:flip` - Flip card
  - `game:match` - Cards match
  - `game:mismatch` - Cards don't match
  - `game:end` - Game ends

#### 8. Quick Questions
- **Players**: 1+
- **Questions**: 10-20 questions
- **Categories**: Various topics
- **Time Limit**: 30 seconds per question
- **Scoring**: Points for correct answers
- **Socket Events**:
  - `game:question` - Send question
  - `game:answer` - Submit answer
  - `game:result` - Check result
  - `game:next` - Next question

## Rooms System

### Room Features

**Core Features**:
- Public/Private access control
- Member management
- Moderator system
- Activity logging
- Join requests for private rooms

**Module System**:
- Games: Enable/disable game playing
- Chat: Enable/disable messaging
- Voice: Enable/disable voice channel
- Media Share: Enable/disable file sharing
- Polls: Enable/disable poll creation

**Room Settings**:
- Name, description, image, banner
- Max members limit
- Custom rules
- Tags for categorization

### Room Lifecycle

1. **Creation**: User creates room with settings
2. **Public**: Anyone can join (direct)
3. **Private**: Join requests sent to moderators
4. **Activity**: Members interact, mods manage
5. **Archive**: Room can be archived
6. **Delete**: Only creator can delete

## Communities System

### Community Features

**Categories**:
- Gaming
- Arts
- Music
- Sports
- Education
- Technology
- Entertainment
- Other

**Features**:
- Browse by category
- Trending communities (by members/views)
- Join/leave functionality
- Private communities with requests
- Member verification

### Community Moderation

- Creator is initial moderator
- Promote members to moderator
- Remove members
- Manage content (posts)
- Enforce rules

## Admin Panel

### Admin Capabilities

**User Management**:
- View all users with search
- Filter by role (user, moderator, admin)
- Ban/unban users
- Promote to moderator or admin
- View user statistics

**Room Management**:
- View all rooms
- Delete problematic rooms
- Monitor room activity
- Check member counts

**Community Management**:
- View all communities
- Delete communities
- Monitor growth
- Check categories

**Report Management**:
- View pending reports
- Review report details
- Take action (warning, ban, delete)
- Add admin notes
- Mark resolved

**Module Configuration**:
- Enable/disable features globally
- Toggle modules (games, rooms, communities, etc.)
- Configure features (voice, video, streaming)
- Set themes

**System Statistics**:
- Total users count
- Total rooms count
- Total communities count
- Pending reports count
- User growth trends

## Modules System

### Available Modules

**Platform Modules**:
- Games - Multiplayer game system
- Rooms - Room creation and management
- Communities - Community system
- Dashboard - User dashboard
- Presentation Mode - Special UI mode
- Admin Panel - Administrative interface

**Feature Toggles**:
- Infinite Scroll - Enable for feeds
- Real-time Notifications - Enable for alerts
- Voice Chat - Enable voice channels
- Video Chat - Enable video calling
- Live Streaming - Enable stream broadcast

### Module Configuration

Each module can be:
- Enabled/Disabled at platform level
- Enabled/Disabled per user
- Configured with specific settings
- Monitored for usage

### Theme Selection

- **Light**: Classic light theme
- **Dark**: Dark mode for night viewing
- **Neon**: Bright neon colors
- **Cyber**: Cyberpunk-style theme

## Database Models

### Room Model
```javascript
{
  name: String,
  description: String,
  image: String,
  banner: String,
  creator: ObjectId(User),
  isPrivate: Boolean,
  members: [ObjectId(User)],
  moderators: [ObjectId(User)],
  maxMembers: Number,
  rules: String,
  enabledModules: {
    games: Boolean,
    chat: Boolean,
    voice: Boolean,
    mediaShare: Boolean,
    polls: Boolean
  },
  activityLog: [{}],
  tags: [String],
  joinRequests: [{}],
  createdAt: Date,
  updatedAt: Date
}
```

### Community Model
```javascript
{
  name: String (unique),
  description: String,
  banner: String,
  logo: String,
  creator: ObjectId(User),
  members: [ObjectId(User)],
  moderators: [ObjectId(User)],
  category: String (enum),
  tags: [String],
  rules: String,
  isPrivate: Boolean,
  totalMembers: Number,
  totalPosts: Number,
  totalViews: Number,
  joinRequests: [{}],
  createdAt: Date,
  updatedAt: Date
}
```

### GameSession Model
```javascript
{
  gameType: String (enum),
  roomId: ObjectId(Room),
  players: [{
    userId: ObjectId(User),
    username: String,
    score: Number,
    isReady: Boolean,
    position: Number
  }],
  gameState: Mixed,
  status: String (enum: waiting, playing, finished, abandoned),
  winner: ObjectId(User),
  winnerName: String,
  startedAt: Date,
  endedAt: Date,
  maxPlayers: Number,
  roundNumber: Number,
  totalRounds: Number,
  scoreBoard: [{}],
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model
```javascript
{
  reportedBy: ObjectId(User),
  reportType: String (enum: user, post, room, community, other),
  reportedItemId: ObjectId,
  reason: String,
  description: String,
  status: String (enum: pending, reviewing, resolved, rejected),
  adminNotes: String,
  resolvedBy: ObjectId(User),
  resolvedAt: Date,
  action: String (enum: none, warning, suspend, ban, delete),
  createdAt: Date,
  updatedAt: Date
}
```

### ModuleConfig Model
```javascript
{
  platform: String (enum: system, user),
  userId: ObjectId(User),
  modules: {
    games: Boolean,
    rooms: Boolean,
    communities: Boolean,
    dashboard: Boolean,
    presentationMode: Boolean,
    adminPanel: Boolean
  },
  theme: String (enum: light, dark, neon, cyber),
  features: {
    infiniteScroll: Boolean,
    realtimeNotifications: Boolean,
    voiceChat: Boolean,
    videoChat: Boolean,
    liveStreaming: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Socket.IO Events

### Game Events
```javascript
// Starting a game
socket.emit('game:start', { roomId, gameType, players })
socket.on('game:started', (sessionData) => {})

// During gameplay
socket.emit('game:move', { sessionId, move })
socket.on('game:state', (gameState) => {})

// Game end
socket.emit('game:finish', { sessionId, scores })
socket.on('game:finished', (results) => {})
```

### Room Events
```javascript
// Member events
socket.emit('room:join', { roomId })
socket.on('room:memberJoined', (member) => {})

socket.emit('room:leave', { roomId })
socket.on('room:memberLeft', (member) => {})

// Chat events
socket.emit('room:message', { roomId, message })
socket.on('room:newMessage', (message) => {})
```

### Community Events
```javascript
socket.emit('community:join', { communityId })
socket.on('community:joined', (community) => {})

socket.emit('community:leave', { communityId })
socket.on('community:left', (community) => {})

socket.emit('community:post', { communityId, post })
socket.on('community:newPost', (post) => {})
```

## API Response Formats

### Success Response
```javascript
{
  message: String,
  data: Object|Array,
  status: "success",
  code: Number
}
```

### Error Response
```javascript
{
  error: String,
  message: String,
  code: Number,
  timestamp: Date
}
```

### List Response
```javascript
{
  data: Array,
  total: Number,
  page: Number,
  pages: Number,
  limit: Number
}
```

## Performance Considerations

### Optimization Strategies
1. **Pagination**: All list endpoints support pagination
2. **Search Indexes**: Text search on names/descriptions
3. **Lazy Loading**: Frontend loads content on demand
4. **Caching**: Trending data cached periodically
5. **Compression**: Enable gzip on API responses

### Database Indexes
```javascript
// Rooms
roomSchema.index({ creator: 1, createdAt: -1 })
roomSchema.index({ name: 'text', description: 'text' })

// Communities
communitySchema.index({ name: 'text', description: 'text', tags: 1 })
communitySchema.index({ category: 1, createdAt: -1 })

// GameSessions
gameSessionSchema.index({ roomId: 1, createdAt: -1 })
gameSessionSchema.index({ gameType: 1 })

// Reports
reportSchema.index({ status: 1, createdAt: -1 })
reportSchema.index({ reportType: 1 })
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

### Common Error Messages
```javascript
{
  'unauthorized': 'Authentication required',
  'forbidden': 'Admin access required',
  'notFound': 'Resource not found',
  'validation': 'Invalid input data',
  'serverError': 'Internal server error'
}
```

---

*Last Updated: December 2024*
