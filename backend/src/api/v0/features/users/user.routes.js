// /backend/src/api/v1/features/users/user.routes.js
import express from 'express';
import * as userController from './user.controller.js';
import { protect } from '../../../../middleware/auth.middleware.js';  // Import protect middleware

const router = express.Router();

// --- Authentication Routes ---
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// --- Google OAuth Routes ---
router.get('/google', userController.redirectToGoogleConsent);
router.get('/google/callback', userController.handleGoogleCallback);

// --- Profile Routes (Protected) ---
router.route('/profile')
   .get(protect, userController.getProfile)
   .put(protect, userController.updateProfile);

export default router;