# 🎯 QUICK START GUIDE - Bondos Ultra Social

## ⚡ Get Running in 3 Minutes!

### **Step 1: Install** (1 min)
```bash
cd /workspaces/bondos_ultra_social
chmod +x scripts/install.sh
./scripts/install.sh
```

### **Step 2: Configure** (1 min)
```bash
# .env already created, but review if needed:
cat .env.example
nano .env  # Optional: edit if changing MongoDB URI
```

### **Step 3: Run** (instant)
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

**✨ Done! Open browser:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 🎬 Test the App (5 minutes)

### 1️⃣ Register
```
1. Click "Register"
2. Enter username: testuser
3. Enter email: test@example.com
4. Enter password: Password123!
5. Click "Register"
```

### 2️⃣ Create Post
```
1. Go to Feed
2. Create a post with title & content
3. Submit
4. See it appear in feed
```

### 3️⃣ Like & Comment
```
1. Find a post
2. Click ❤️ to like
3. Click 💬 to comment
4. Toggle 🌙 for dark mode
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main features & tech stack |
| `SETUP.md` | Detailed setup & API docs |
| `PROJECT_OVERVIEW.md` | Architecture & flows |
| `COMPLETION_SUMMARY.md` | What was built |
| `QUICK_START.md` | This file! |

---

## 🚀 Deployment Options

### **Option A: Docker (Recommended)**
```bash
docker-compose up -d
# Full stack on http://localhost:80
# Stop: docker-compose down
```

### **Option B: Production**
```bash
./scripts/build.sh      # Build frontend
./scripts/start.sh      # Start backend
# Frontend: Serve dist/ folder with your web server
# Backend: Running on port 5000
```

### **Option C: Cloud**
```bash
# Deploy Docker image to:
# - AWS (ECS/EC2)
# - Google Cloud (Cloud Run)
# - Azure (ACI)
# - DigitalOcean (App Platform)
# - Heroku (using docker)
```

---

## 🔑 API Quick Reference

### **Authentication**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"user1",
    "email":"user@example.com",
    "password":"pass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"pass123"
  }'
```

### **Posts**
```bash
# Get all posts
curl http://localhost:5000/api/posts

# Create post (with auth)
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Post",
    "content":"Hello world!",
    "category":"technology"
  }'

# Like post
curl -X POST http://localhost:5000/api/posts/:postId/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Users**
```bash
# Get user profile
curl http://localhost:5000/api/users/:userId

# Follow user
curl -X POST http://localhost:5000/api/users/:userId/follow \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search users
curl "http://localhost:5000/api/users/search?query=john"
```

---

## 📊 Project Stats at a Glance

| Metric | Count |
|--------|-------|
| Total Files | 58+ |
| API Endpoints | 22 |
| Backend Controllers | 4 |
| Backend Models | 3 |
| Frontend Pages | 5 |
| Frontend Components | 4 |
| React Hooks | 2 |
| Database Collections | 3 |
| Lines of Code | 3,500+ |

---

## 🛠️ All Scripts

```bash
# From project root:

npm run install              # Install dependencies
npm run dev                  # Start dev servers
npm run build                # Build for production
npm run start                # Start production server
npm run docker:up            # Start Docker stack
npm run docker:down          # Stop Docker stack
npm run docker:logs          # View Docker logs

# Or direct scripts:
./scripts/install.sh         # Same as npm run install
./scripts/dev.sh             # Same as npm run dev
./scripts/build.sh           # Same as npm run build
./scripts/start.sh           # Same as npm run start
```

---

## 🔐 Environment Variables

**Key variables in `.env`:**

```bash
# Backend
BACKEND_PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bondos_ultra_social

# Authentication
JWT_ACCESS_SECRET=your_secret_key_change_in_production
JWT_REFRESH_SECRET=your_secret_key_change_in_production

# Frontend API
VITE_API_URL=http://localhost:5000/api

# Security
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Before Production:**
- Change `JWT_ACCESS_SECRET` to random 32+ character string
- Change `JWT_REFRESH_SECRET` to random 32+ character string
- Set `CORS_ORIGIN` to your domain
- Use MongoDB Atlas, not local
- Set `NODE_ENV=production`

---

## 🐛 Troubleshooting

### **Problem: Port already in use**
```bash
# Find and kill process
lsof -i :5173  # or :5000
kill -9 <PID>
```

### **Problem: MongoDB connection failed**
```bash
# Option 1: Start MongoDB locally
mongosh

# Option 2: Use Docker
docker run -d -p 27017:27017 mongo:7.0

# Option 3: Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bondos_ultra_social
```

### **Problem: Dependencies not installing**
```bash
# Clear and reinstall
rm -rf node_modules client/node_modules server/node_modules
rm -rf package-lock.json client/package-lock.json server/package-lock.json
./scripts/install.sh
```

### **Problem: Can't login**
1. Verify user was registered
2. Check email/password are correct
3. Verify MongoDB is running
4. Check backend logs

---

## 📱 Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers

---

## 🎓 Learning Path

**New to the project?**

1. Read `README.md` (2 min) - Overview
2. Read `SETUP.md` (5 min) - Setup details
3. Run `./scripts/dev.sh` (1 min) - Get it working
4. Explore code:
   - `client/src/App.jsx` - Frontend entry
   - `server/src/index.js` - Backend entry
   - `client/src/pages/` - Page components
   - `server/src/controllers/` - API logic
5. Read `PROJECT_OVERVIEW.md` (10 min) - Deep dive

**Want to extend?**

1. Check existing patterns in code
2. Add new route in `server/src/routes/`
3. Add controller in `server/src/controllers/`
4. Add page in `client/src/pages/`
5. Update API service in `client/src/services/api.js`

---

## 🔄 Development Workflow

```
┌─────────────────────────────────────┐
│  Start: ./scripts/dev.sh            │
├─────────────────────────────────────┤
│  ✓ Frontend hot-reload at :5173     │
│  ✓ Backend auto-restart at :5000    │
│  ✓ MongoDB ready                    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Code Changes                        │
│  ✓ Save frontend → Auto reload      │
│  ✓ Save backend → Auto restart      │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Test in Browser                    │
│  ✓ http://localhost:5173 (frontend) │
│  ✓ http://localhost:5000/api (backend)
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Ready for Production                │
│  ✓ ./scripts/build.sh (build)       │
│  ✓ docker-compose up -d (deploy)    │
└─────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Use Postman** - Test API endpoints easily
2. **Use MongoDB Compass** - Inspect database
3. **Check console logs** - Debugging helper
4. **Use browser DevTools** - Frontend debugging
5. **Keep `.env` secure** - Never commit it
6. **Test before deploy** - Always!
7. **Monitor logs** - Know what's happening
8. **Backup database** - Protect your data
9. **Update dependencies** - Security patches
10. **Version your API** - Plan for growth

---

## ✨ Features Summary

### **What You Can Do**
- ✅ Register & login securely
- ✅ Create & share posts
- ✅ Like & comment on posts
- ✅ Follow/unfollow users
- ✅ View user profiles
- ✅ Search posts & users
- ✅ Toggle dark/light mode
- ✅ Customize theme colors
- ✅ Filter by category
- ✅ Upload images

### **How It's Built**
- ✅ React for UI
- ✅ Express for API
- ✅ MongoDB for data
- ✅ JWT for security
- ✅ Docker for deployment
- ✅ TailwindCSS for styling
- ✅ Vite for speed

---

## 🚀 Next Steps

1. **Immediate** (Today)
   - Run `./scripts/dev.sh`
   - Register & create a post
   - Test all features

2. **This Week**
   - Customize UI/colors
   - Add more features
   - Test thoroughly

3. **Before Launch**
   - Security review
   - Performance testing
   - Deploy to production
   - Monitor in production

---

## 📞 Need Help?

1. **Check documentation** - READ the .md files!
2. **Google the error** - Stack Overflow has answers
3. **Check logs** - Console tells you what's wrong
4. **Review code** - Comments explain the logic
5. **Debug step-by-step** - Find the issue

---

## ✅ Verification Checklist

Before claiming "ready":

- [ ] `./scripts/install.sh` ran successfully
- [ ] `./scripts/dev.sh` starts both servers
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend responds at http://localhost:5000
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create post
- [ ] Can like/unlike posts
- [ ] Can follow users
- [ ] Dark mode toggle works
- [ ] All pages load without errors

---

## 📜 Quick Command Reference

```bash
# Daily commands
./scripts/dev.sh          # Start developing
Ctrl+C                    # Stop servers

# Build & deploy
./scripts/build.sh        # Build for production
./scripts/start.sh        # Start production
docker-compose up -d      # Deploy with Docker

# Maintenance
npm install               # Update dependencies
git status                # Check changes
git commit -am "msg"      # Commit changes
git push origin main      # Push to GitHub
```

---

## 🎉 Ready to Start!

```bash
# Go to project directory
cd /workspaces/bondos_ultra_social

# Install dependencies
./scripts/install.sh

# Start development
./scripts/dev.sh

# Open http://localhost:5173 in browser
# Happy coding! 🚀
```

---

**That's it! You're ready to build amazing things!**

*For detailed info, see:*
- *README.md* - Overview
- *SETUP.md* - Complete setup
- *PROJECT_OVERVIEW.md* - Architecture

---

*Last Updated: 2025-12-10*
*Quick Start v1.0*
