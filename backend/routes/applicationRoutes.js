import express from 'express';
import {
  submitApplication,
  getMyApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteMyApplication,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User specific routes
router.route('/').post(protect, submitApplication);
router.route('/my')
  .get(protect, getMyApplication)
  .delete(protect, deleteMyApplication);

// Admin specific routes
router.route('/').get(protect, admin, getAllApplications);
router.route('/:id/status').put(protect, admin, updateApplicationStatus);

export default router;
