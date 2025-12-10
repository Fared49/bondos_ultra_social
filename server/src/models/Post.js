import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, minlength: 1, maxlength: 300 },
    content: { type: String, required: true },
    images: [String],
    category: { type: String, enum: ['tech', 'life', 'gaming', 'travel', 'other'], default: 'other' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
=======
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
    },
    category: {
      type: String,
      enum: ['technology', 'lifestyle', 'travel', 'food', 'art', 'other'],
      default: 'other',
    },
    images: {
      type: [String],
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
// Index for search and filtering
postSchema.index({ title: 'text', content: 'text', tags: 1 });
postSchema.index({ category: 1 });
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
export default mongoose.model('Post', postSchema);
