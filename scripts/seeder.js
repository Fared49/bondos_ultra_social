const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../server/src/models/User');
const Post = require('../server/src/models/Post');
const Room = require('../server/src/models/Room');
const Message = require('../server/src/models/Message');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondos';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Room.deleteMany({});
    await Message.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create sample users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        firstName: `User`,
        lastName: `${i}`,
        bio: `I love social gaming! User #${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        followers: [],
        following: [],
        blockedUsers: [],
        theme: i % 2 === 0 ? 'dark' : 'light',
        isOnline: true,
      });
      users.push(user);
      console.log(`✓ Created user${i}`);
    }

    // Create follower relationships
    for (let i = 0; i < users.length - 1; i++) {
      users[i].following.push(users[i + 1]._id);
      users[i + 1].followers.push(users[i]._id);
    }
    await User.insertMany(users, { ordered: false }).catch(() => {});

    // Create sample rooms
    const rooms = [];
    for (let i = 1; i <= 5; i++) {
      const room = await Room.create({
        name: `Gaming Room ${i}`,
        description: `A fun place for gamers to chat and play! Room #${i}`,
        owner: users[0]._id,
        members: users.slice(0, Math.min(5, users.length)).map(u => u._id),
        privacy: i % 3 === 0 ? 'private' : i % 2 === 0 ? 'invite' : 'public',
        modules: ['chat', 'posts', 'games', 'polls'],
        avatar: `https://via.placeholder.com/150?text=Room${i}`,
        inviteCode: `INVITE${i}${Math.random().toString(36).substr(2, 9)}`,
        games: [],
      });
      rooms.push(room);
      console.log(`✓ Created room: ${room.name}`);
    }

    // Create sample posts
    for (let i = 1; i <= 20; i++) {
      const author = users[i % users.length];
      const post = await Post.create({
        author: author._id,
        title: `Amazing Game Session ${i}`,
        content: `Just finished an epic game! Check out my new high score. This was so much fun! #gaming #bondos`,
        images: [],
        category: ['general', 'gaming', 'social'][i % 3],
        room: rooms[i % rooms.length]._id,
        likes: users.slice(0, (i % 3) + 1).map(u => u._id),
        comments: [],
        tags: ['gaming', 'bondos', 'fun'],
      });
      console.log(`✓ Created post ${i}`);
    }

    // Create sample messages
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      for (let j = 0; j < 5; j++) {
        const sender = room.members[j % room.members.length];
        await Message.create({
          sender: sender,
          room: room._id,
          text: `Hey everyone! Having fun in ${room.name}? Message #${j + 1}`,
          type: 'text',
          data: {},
        });
      }
      console.log(`✓ Created 5 messages for ${room.name}`);
    }

    console.log('\n✅ Database seeding complete!');
    console.log(`📊 Summary:`);
    console.log(`   Users: 10`);
    console.log(`   Rooms: 5`);
    console.log(`   Posts: 20`);
    console.log(`   Messages: 25`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
