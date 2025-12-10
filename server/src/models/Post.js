import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
