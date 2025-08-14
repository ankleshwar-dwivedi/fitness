import express from 'express';
import { getTodaySummary, getPerformanceReport } from './dashboard.controllers.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/today', protect, getTodaySummary);
router.get('/performance', protect, getPerformanceReport); // e.g., /performance?range=weekly

export default router;