import mongoose from 'mongoose';

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
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function() {
  const { password, refreshToken, ...user } = this.toObject();
  return user;
};

export default mongoose.model('User', userSchema);
