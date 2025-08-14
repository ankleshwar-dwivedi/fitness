import express from 'express';
import { addWaterLog, getWaterLogForDate } from './water.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/:date')
    .get(protect, getWaterLogForDate);

router.route('/add')
    .post(protect, addWaterLog);

export default router;