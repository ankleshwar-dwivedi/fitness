import express from 'express';
import { getMyFitnessPlan, upsertMyFitnessPlan } from './fitness.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/plan')
  .get(protect, getMyFitnessPlan)
  .put(protect, upsertMyFitnessPlan); // Upsert (update or insert)

export default router;