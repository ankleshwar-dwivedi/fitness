import asyncHandler from '../../../utils/asyncHandler.js';
import AppError from '../../../utils/AppError.js';
import User from './user.model.js';

// @desc    Get current user's profile
// @route   GET /api/v0/users/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res, next) => {
    // req.user is populated by the `protect` middleware
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User not found.', 404));
    }
    res.status(200).json(user);
});

// @desc    Update current user's profile
// @route   PUT /api/v0/users/me
// @access  Private
export const updateMyProfile = asyncHandler(async (req, res, next) => {
    // Only allow updating non-sensitive fields
    const { name, gender, dateOfBirth } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, gender, dateOfBirth },
        { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
        return next(new AppError('User not found.', 404));
    }

    res.status(200).json(updatedUser);
});