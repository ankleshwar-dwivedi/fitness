//backend/src/api/v0/auth/auth.service.js

import User from '../user/user.model.js';
import AppError from '../../../utils/AppError.js';
import { google } from 'googleapis';
import config from '../../../config/index.js';
const oauth2Client = new google.auth.OAuth2(
config.google.clientId,
config.google.clientSecret,
config.google.redirectUri
);

class AuthService {
 async registerUser(userData) {
        if (!userData.password || userData.password !== userData.passwordConfirm) {
            throw new AppError('Passwords do not match.', 400);
        }
        const userExists = await User.findOne({ email: userData.email });
        if (userExists) {
            throw new AppError('User with this email already exists.', 409); // 409 Conflict
        }
        const user = await User.create(userData);
        return user;
    }

    async loginUser(email, password) {
        if (!email || !password) {
            throw new AppError('Please provide email and password.', 400);
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            throw new AppError('Invalid email or password.', 401);
        }
        return user;
    }
    
        getGoogleUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar',
            // Add 'https://www.googleapis.com/auth/fitness.activity.read' for Google Fit later
        ];

        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });
    }

    
    async handleGoogleLogin(code) {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const googleUser = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });
        const { id, email, name, gender, birthday } = googleUser.data;

        let user = await User.findOne({ googleId: id });
        
        if (!user) {
            user = await User.findOne({ email: email });
            if (user) {
                // Link existing account
                user.googleId = id;
            } else {
                // Create new user
                user = new User({
                    googleId: id,
                    email: email,
                    name: name,
                    // Note: Google's gender/birthday info might not always be available
                    // gender: gender, 
                    // dateOfBirth: birthday ? new Date(birthday) : null
                });
            }
        }
        
        // Update tokens for API access
        if (tokens.access_token) user.googleAccessToken = tokens.access_token;
        if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;

        await user.save({ validateBeforeSave: false }); // Bypass password validation for Google users

        return user;
    }

async processGoogleCallback(code) {
    // 1. Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Get user info from Google
    const googleOauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
    });
    const { data } = await googleOauth2.userinfo.get();
    
    // 3. Find or create user in our database
    let user = await User.findOne({ googleId: data.id });

    if (user) {
        // User exists, just update tokens if they've changed
        user.googleAccessToken = tokens.access_token;
        if (tokens.refresh_token) {
            user.googleRefreshToken = tokens.refresh_token;
        }
        await user.save();
        return user;
    }

    // If no user with that googleId, check if email exists
    user = await User.findOne({ email: data.email });
    if (user) {
        // Email exists (manual account), link it to Google
        user.googleId = data.id;
        user.googleAccessToken = tokens.access_token;
        if (tokens.refresh_token) {
            user.googleRefreshToken = tokens.refresh_token;
        }
        await user.save();
        return user;
    }

    // No existing user, create a new one
    const newUser = await User.create({
        googleId: data.id,
        name: data.name,
        email: data.email,
        // Password is not required for Google users due to model validation
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token, // This is often only sent on the first authorization
    });

    return newUser;
       



}
}
export default new AuthService();