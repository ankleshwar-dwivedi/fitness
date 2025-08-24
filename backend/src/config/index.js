import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Database
  mongoURI: process.env.MONGO_URI,
  
  // Security - THIS IS THE KEY we are fixing
  jwtSecret: process.env.JWT_SECRET,
  
  // Google OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  },

  // External APIs
  apiKeys: {
    calorieNinjas: process.env.CALORIE_NINJAS_API_KEY,
    apiNinjasWorkout: process.env.API_NINJAS_WORKOUT_API_KEY,
    spoonacular: process.env.SPOONACULAR_RAPIDAPI_KEY, // New key
    edamam: {
      appId: process.env.EDAMAM_APP_ID,
      appKey: process.env.EDAMAM_APP_KEY,
    }
  },
};

// Critical validation
if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in your .env file.");
  process.exit(1);
}
if (!config.mongoURI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in your .env file.");
    process.exit(1);
}

export default config;