import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import AppError from './AppError.js';

const generateToken = (res, userId) => {
  // Defensive check to ensure the secret is loaded.
  if (!config.jwtSecret) {
    throw new AppError('JWT Secret not found on server. Cannot log in.', 500);
  }

  const token = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: '1hr',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 1 * 1 * 60 * 60 * 1000, 
  });
};

export default generateToken;