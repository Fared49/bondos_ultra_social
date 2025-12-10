import mongoose from 'mongoose';
<<<<<<< HEAD
=======
import bcrypt from 'bcryptjs';
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
<<<<<<< HEAD
    },
    password: { type: String, required: true, select: false },
    firstName: String,
    lastName: String,
    avatar: String,
    bio: { type: String, maxlength: 500 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    theme: { mode: { type: String, default: 'light' }, primaryColor: String },
    isOnline: { type: Boolean, default: false },
    lastSeenAt: Date,
    refreshToken: { type: String, select: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
=======
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: null,
    },
    theme: {
      mode: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      primaryColor: {
        type: String,
        default: '#3B82F6',
      },
      accentColor: {
        type: String,
        default: '#10B981',
      },
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    statistics: {
      postsCreated: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
      roomsJoined: { type: Number, default: 0 },
      communitiesJoined: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'neon', 'cyber'],
        default: 'light',
      },
      notifications: { type: Boolean, default: true },
      isPrivate: { type: Boolean, default: false },
    },
    refreshToken: {
      type: String,
      select: false,
    },
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
  },
  { timestamps: true }
);

<<<<<<< HEAD
userSchema.methods.toJSON = function() {
  const { password, refreshToken, ...user } = this.toObject();
=======
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Method to get user public data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
  return user;
};

export default mongoose.model('User', userSchema);
