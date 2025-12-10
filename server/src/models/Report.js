import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportType: {
      type: String,
      enum: ['user', 'post', 'room', 'community', 'other'],
      required: true,
    },
    reportedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'resolved', 'rejected'],
      default: 'pending',
    },
    adminNotes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    action: {
      type: String,
      enum: ['none', 'warning', 'suspend', 'ban', 'delete'],
      default: 'none',
    },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reportType: 1 });

export default mongoose.model('Report', reportSchema);
