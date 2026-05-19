import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  getUsers,
  updateUserRole,
  updateUser,
  deleteUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
