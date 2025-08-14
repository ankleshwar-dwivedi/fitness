import express from 'express';
import { processMessage } from './chatbot.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/message', protect, processMessage);

export default router;