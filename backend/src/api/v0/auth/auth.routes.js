import express from 'express';
import { register, login, logout, getGoogleUrl, handleGoogleCallback } from './auth.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

// Google OAuth Routes
router.get('/google/url', getGoogleUrl);
router.get('/google/callback', handleGoogleCallback);

export default router;