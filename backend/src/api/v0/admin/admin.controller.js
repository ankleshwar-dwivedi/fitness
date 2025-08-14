
//backend/src/api/v0/admin/admin.controller.js

import asyncHandler from '../../../utils/asyncHandler.js';
import adminService from './admin.service.js';

export const getAdminDashboardStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
});

export const adminGetAllUsers = asyncHandler(async (req, res) => {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
});

export const adminDeleteUser = asyncHandler(async (req, res) => {
    await adminService.deleteUserById(req.params.id, req.user.id);
    res.status(200).json({ message: 'User deleted successfully.' });
});

export const adminChangeUserPassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    await adminService.changeUserPassword(req.params.id, newPassword);
    res.status(200).json({ message: "User's password updated successfully." });
});