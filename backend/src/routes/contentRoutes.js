import express from 'express';
import {
  uploadContent,
  getMyContent,
  getPending,
  approve,
  reject,
  getLive
} from '../controllers/contentController.js';
import { isAuth, authorizeRoles } from '../middlewares/auth.js';
import upload from '../utils/multer.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Teacher routes
router.post('/', isAuth, authorizeRoles(ROLES.TEACHER), upload.single('file'), uploadContent);
router.get('/my', isAuth, authorizeRoles(ROLES.TEACHER), getMyContent);

// Principal routes
router.get('/pending', isAuth, authorizeRoles(ROLES.PRINCIPAL), getPending);
router.patch('/:id/approve', isAuth, authorizeRoles(ROLES.PRINCIPAL), approve);
router.patch('/:id/reject', isAuth, authorizeRoles(ROLES.PRINCIPAL), reject);

// Public route
router.get('/live/:teacherId', getLive);

export default router;