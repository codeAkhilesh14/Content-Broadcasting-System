import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  file_url: {
    type: String,
    required: [true, 'File URL is required']
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploaded by is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejection_reason: {
    type: String,
    trim: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
contentSchema.index({ uploaded_by: 1, status: 1 });
contentSchema.index({ status: 1 });

const Content = mongoose.model('Content', contentSchema);

export default Content;