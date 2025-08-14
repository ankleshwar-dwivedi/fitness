// /backend/src/api/v1/features/users/user.controller.js
import * as userService from './user.service.js';
import config from '../../../../config/index.js';
import { generateAndSetToken } from '../../../../utils/generateToken.js';
import { getGoogleOAuth2Client } from '../../../../services/google.service.js';

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// --- Auth Controllers ---
export const register = asyncHandler(async (req, res) => {
    const user = await userService.registerUser(req.body);
    generateAndSetToken(res, user._id);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    generateAndSetToken(res, user._id);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
});

export const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: config.nodeEnv !== 'development',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// --- Google Auth Controllers ---
export const redirectToGoogleConsent = (req, res) => {
    const oauth2Client = getGoogleOAuth2Client('sign-in');
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent',
    });
    res.redirect(authorizeUrl);
};

export const handleGoogleCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;
    const googleProfile = await userService.getGoogleUserProfile(code);
    const user = await userService.findOrCreateGoogleUser(googleProfile);
    generateAndSetToken(res, user._id);
    
    // Check for placeholder DOB to signal profile completion is needed
    if (user.dateOfBirth.getTime() === 0) {
        return res.redirect(`${config.frontendUrl}/complete-profile`);
    }
    res.redirect(`${config.frontendUrl}/dashboard`);
});


// --- User Profile Controllers ---
export const getProfile = asyncHandler(async (req, res) => {
    // The `protect` middleware already attaches the user to req.user.
    // We call the service to ensure we get the latest data if needed.
    const user = await userService.getUserProfile(req.user._id);
    res.status(200).json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    // The `protect` middleware gives us the user ID.
    // We pass the update data from the request body to the service.
    const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
    res.status(200).json(updatedUser);
});