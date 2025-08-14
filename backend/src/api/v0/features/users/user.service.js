// /backend/src/api/v1/features/users/user.service.js
import User from './user.model.js';
import AppError from '../../../../utils/AppError.js';
import { getGoogleOAuth2Client } from '../../../../services/google.service.js';
import config from '../../../../config/index.js';

/**
 * Registers a new user with email and password.
 * @param {object} userData - User registration data.
 * @returns {Promise<object>} The created user object.
 */
export const registerUser = async (userData) => {
    const { email, name, password, gender, dateOfBirth } = userData;

    if (!email || !name || !password || !gender || !dateOfBirth) {
        throw new AppError('Please provide all required fields: name, email, password, gender, dateOfBirth', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists with this email', 400);
    }
    const user = await User.create({ name, email, password, gender, dateOfBirth });
    // Manually remove password from the returned object
    user.password = undefined;
    return user;
};

/**
 * Logs in a user with email and password.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<object>} The authenticated user object.
 */
export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password
    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }
    user.password = undefined; // Manually remove password
    return user;
};

/**
 * Finds or creates a user based on Google profile data.
 * @param {object} googleProfile - Profile data from Google ID token.
 * @returns {Promise<object>} The found or created user object.
 */
export const findOrCreateGoogleUser = async (googleProfile) => {
    // ... (existing findOrCreateGoogleUser function, no changes needed yet)
    const { sub: googleId, email, name, given_name } = googleProfile;

    let user = await User.findOne({ email });

    if (user) {
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
        return user;
    } else {
        const newUser = await User.create({
            googleId,
            email,
            name: name || given_name,
            gender: 'Prefer not to say', // Placeholder
            dateOfBirth: new Date(0), // Placeholder
        });
        return newUser;
    }
};

/**
 * Retrieves user info from Google using an authorization code.
 * @param {string} code - The authorization code from Google redirect.
 * @returns {Promise<object>} The Google user profile payload.
 */
export const getGoogleUserProfile = async (code) => {
    // ... (existing getGoogleUserProfile function, no changes needed)
    try {
        const oauth2Client = getGoogleOAuth2Client('sign-in');
        const { tokens } = await oauth2Client.getToken(code);
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: config.google.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new AppError('Failed to retrieve user profile from Google', 500);
        }
        return payload;
    } catch (error) {
        console.error("Error getting Google user profile:", error.message);
        throw new AppError('Invalid Google authorization code or token', 400);
    }
};

/**
 * Retrieves the profile for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The user profile object.
 */
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

/**
 * Updates the profile and status for a given user ID.
 * @param {string} userId - The ID of the user.
 * @param {object} updateData - The data to update.
 * @returns {Promise<object>} The updated user object.
 */
export const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // --- Whitelist fields that can be updated ---
    // User Details
    if (updateData.name) user.name = updateData.name;
    if (updateData.gender) user.gender = updateData.gender;
    if (updateData.dateOfBirth) user.dateOfBirth = updateData.dateOfBirth;
    // Note: Email and password changes should have separate, more secure flows.
    // We are not allowing password changes through this generic update endpoint.

    // Fitness Status Details (nested in 'status' object)
    // Initialize status object if it doesn't exist
    if (!user.status) {
        user.status = {};
    }
    if (updateData.status) {
        if (updateData.status.height !== undefined) user.status.height = updateData.status.height;
        if (updateData.status.weight !== undefined) user.status.weight = updateData.status.weight;
        if (updateData.status.goalWeight !== undefined) user.status.goalWeight = updateData.status.goalWeight;
        if (updateData.status.activityLevel !== undefined) user.status.activityLevel = updateData.status.activityLevel;
        if (updateData.status.goal !== undefined) user.status.goal = updateData.status.goal;
    }

    const updatedUser = await user.save();
    return updatedUser;
};