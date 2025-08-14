//backend/src/api/v0/admin/admin.routes.js

import express from 'express';
import { adminGetAllUsers, adminDeleteUser, getAdminDashboardStats, adminChangeUserPassword } from './admin.controller.js';
import { protect, admin } from '../../../middleware/auth.middleware.js';
const router = express.Router();
// All routes in this file are protected and require admin privileges
router.use(protect, admin);
router.get('/stats', getAdminDashboardStats);
router.get('/users', adminGetAllUsers);
router.delete('/users/:id', adminDeleteUser);
router.put('/users/:id/password', adminChangeUserPassword);


export default router;