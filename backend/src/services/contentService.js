import Content from '../models/Content.js';
import Schedule from '../models/Schedule.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createContent = async (contentData, file, userId) => {
  const { title, subject, start_time, end_time, rotation_duration } = contentData;

  // Upload file to Cloudinary
  const localFilePath = path.join(__dirname, '../../public', file.filename);
  const cloudinaryResult = await uploadToCloudinary(localFilePath);

  // Create content
  const content = await Content.create({
    title,
    subject,
    file_url: cloudinaryResult.url,
    uploaded_by: userId
  });

  // Create schedule
  await Schedule.create({
    content_id: content._id,
    start_time: new Date(start_time),
    end_time: new Date(end_time),
    rotation_duration: parseInt(rotation_duration),
    rotation_order: 0 // Will be updated based on existing schedules
  });

  // Update rotation order for all schedules of this teacher
  await updateRotationOrders(userId);

  return content;
};

export const getTeacherContent = async (userId) => {
  return await Content.find({ uploaded_by: userId })
    .populate('uploaded_by', 'name email')
    .populate('approved_by', 'name email')
    .sort({ createdAt: -1 });
};

export const getPendingContent = async () => {
  return await Content.find({ status: 'pending' })
    .populate('uploaded_by', 'name email')
    .sort({ createdAt: -1 });
};

export const approveContent = async (contentId, userId) => {
  const content = await Content.findByIdAndUpdate(
    contentId,
    {
      status: 'approved',
      approved_by: userId,
      rejection_reason: null
    },
    { new: true }
  ).populate('uploaded_by', 'name email')
   .populate('approved_by', 'name email');

  if (!content) {
    throw new Error('Content not found');
  }

  return content;
};

export const rejectContent = async (contentId, userId, reason) => {
  const content = await Content.findByIdAndUpdate(
    contentId,
    {
      status: 'rejected',
      approved_by: userId,
      rejection_reason: reason
    },
    { new: true }
  ).populate('uploaded_by', 'name email')
   .populate('approved_by', 'name email');

  if (!content) {
    throw new Error('Content not found');
  }

  return content;
};

export const getLiveContent = async (teacherId) => {
  const currentTime = new Date();

  // Get all approved content for the teacher within time window
  const contents = await Content.aggregate([
    {
      $match: {
        uploaded_by: teacherId,
        status: 'approved'
      }
    },
    {
      $lookup: {
        from: 'schedules',
        localField: '_id',
        foreignField: 'content_id',
        as: 'schedule'
      }
    },
    {
      $unwind: '$schedule'
    },
    {
      $match: {
        'schedule.start_time': { $lte: currentTime },
        'schedule.end_time': { $gte: currentTime }
      }
    },
    {
      $sort: { 'schedule.rotation_order': 1 }
    },
    {
      $group: {
        _id: '$subject',
        contents: { $push: '$$ROOT' }
      }
    }
  ]);

  // Apply rotation logic
  const result = [];
  for (const group of contents) {
    const { contents: groupContents } = group;
    if (groupContents.length === 0) continue;

    const totalContent = groupContents.length;
    const rotationDuration = groupContents[0].schedule.rotation_duration * 1000; // Convert to milliseconds
    const index = Math.floor(currentTime.getTime() / rotationDuration) % totalContent;

    result.push(groupContents[index]);
  }

  return result;
};

// Helper function to update rotation orders
const updateRotationOrders = async (userId) => {
  const schedules = await Schedule.find()
    .populate({
      path: 'content_id',
      match: { uploaded_by: userId, status: 'pending' }
    })
    .sort({ createdAt: 1 });

  for (let i = 0; i < schedules.length; i++) {
    if (schedules[i].content_id) {
      await Schedule.findByIdAndUpdate(schedules[i]._id, { rotation_order: i });
    }
  }
};