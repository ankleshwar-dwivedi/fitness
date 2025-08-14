import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../api/v0/user/user.model.js';
import config from '../config/index.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized, no token provided.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = await User.findById(decoded.userId).select('-password -googleRefreshToken');

    if (!req.user) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed.', 401));
  }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return next(new AppError('Not authorized as an admin.', 403));
    }
};


export { protect, admin };