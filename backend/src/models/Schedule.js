import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: [true, 'Content ID is required']
  },
  start_time: {
    type: Date,
    required: [true, 'Start time is required']
  },
  end_time: {
    type: Date,
    required: [true, 'End time is required']
  },
  rotation_duration: {
    type: Number,
    required: [true, 'Rotation duration is required'],
    min: [1, 'Rotation duration must be at least 1 second']
  },
  rotation_order: {
    type: Number,
    required: [true, 'Rotation order is required'],
    min: [0, 'Rotation order must be non-negative']
  }
}, {
  timestamps: true
});

// Index for efficient queries
scheduleSchema.index({ content_id: 1 });
scheduleSchema.index({ start_time: 1, end_time: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;