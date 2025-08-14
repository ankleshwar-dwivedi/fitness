//backend/src/api/v0/auth/auth.controller.js
import asyncHandler from '../../../utils/asyncHandler.js';
import authService from './auth.service.js';
import generateToken from '../../../utils/generateToken.js';
import config from '../../../config/index.js';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm, gender, dateOfBirth } = req.body;
  const user = await authService.registerUser({ name, email, password, passwordConfirm, gender, dateOfBirth });

  generateToken(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  
  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getGoogleUrl = (req, res) => {
    const url = authService.generateGoogleAuthUrl();
    res.status(200).json({ url });
};

export const handleGoogleCallback = asyncHandler(async (req, res, next) => {
    const code = req.query.code;
    const user = await authService.processGoogleCallback(code);

    generateToken(res, user._id);
    
    // Redirect to the frontend, which will handle routing to admin/user dashboard
    const redirectUrl = user.isAdmin ? `${config.frontendUrl}/admin` : `${config.frontendUrl}/dashboard`;
    res.redirect(redirectUrl);
});
