import {
  createContent,
  getTeacherContent,
  getPendingContent,
  approveContent,
  rejectContent,
  getLiveContent
} from '../services/contentService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadContent = asyncHandler(async (req, res) => {
  const { title, subject, start_time, end_time, rotation_duration } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File is required'
    });
  }

  if (!title || !subject || !start_time || !end_time || !rotation_duration) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const content = await createContent(
    { title, subject, start_time, end_time, rotation_duration },
    req.file,
    req.user._id
  );

  res.status(201).json({
    success: true,
    message: 'Content uploaded successfully',
    data: content
  });
});

export const getMyContent = asyncHandler(async (req, res) => {
  const contents = await getTeacherContent(req.user._id);

  res.status(200).json({
    success: true,
    data: contents
  });
});

export const getPending = asyncHandler(async (req, res) => {
  const contents = await getPendingContent();

  res.status(200).json({
    success: true,
    data: contents
  });
});

export const approve = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const content = await approveContent(id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Content approved successfully',
    data: content
  });
});

export const reject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Rejection reason is required'
    });
  }

  const content = await rejectContent(id, req.user._id, reason);

  res.status(200).json({
    success: true,
    message: 'Content rejected successfully',
    data: content
  });
});

export const getLive = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  if (!teacherId) {
    return res.status(400).json({
      success: false,
      message: 'Teacher ID is required'
    });
  }

  const contents = await getLiveContent(teacherId);

  res.status(200).json({
    success: true,
    data: contents
  });
});