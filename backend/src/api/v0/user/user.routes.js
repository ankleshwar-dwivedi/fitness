import express from 'express';
import { getMyProfile, updateMyProfile } from './user.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

export default router;