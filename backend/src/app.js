import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';

// Import v0 routes
import authRoutesV0 from './api/v0/auth/auth.routes.js';
import userRoutesV0 from './api/v0/user/user.routes.js';
import fitnessRoutesV0 from './api/v0/fitness/fitness.routes.js';
import loggingRoutesV0 from './api/v0/logging/logging.routes.js';
import dashboardRoutesV0 from './api/v0/dashboard/dashboard.routes.js';
import chatbotRoutesV0 from './api/v0/chatbot/chatbot.routes.js';
import plannerRoutesV0 from './api/v0/planners/planners.routes.js';
import adminRoutesV0 from './api/v0/admin/admin.routes.js';
import waterRoutesV0 from './api/v0/water/water.routes.js';


const app = express();


// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // For development, allow any origin or specific ones like Vite's default port
    // For production, you'd use config.frontendUrl
    const allowedOrigins = config.nodeEnv === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000'] // Vite default port
      : [/* config.frontendUrl */]; // Add your production frontend URL here
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
 
// API Routes
app.get('/', (req, res) => res.send('API is alive!'));

// Version 0 Routes
app.use('/api/v0/admin', adminRoutesV0);
app.use('/api/v0/auth', authRoutesV0);
app.use('/api/v0/users', userRoutesV0);
app.use('/api/v0/fitness', fitnessRoutesV0);
app.use('/api/v0/log', loggingRoutesV0);
app.use('/api/v0/dashboard', dashboardRoutesV0);
app.use('/api/v0/chatbot', chatbotRoutesV0);
app.use('/api/v0/planners', plannerRoutesV0);
app.use('/api/v0/water', waterRoutesV0);


// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;