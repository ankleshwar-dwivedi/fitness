// /backend/src/api/v1/features/meals/meal.routes.js
import express from 'express';
import * as mealController from './meal.controller.js';
import { protect } from '../../../../middleware/auth.middleware.js';

const router = express.Router();

// All meal routes are protected
router.use(protect);

router.route('/')
    .post(mealController.addMeal);

router.route('/:date')
    .get(mealController.getMeals);

router.route('/:mealId/items/:itemId')
    .delete(mealController.deleteMealItem);

export default router;
//This provides the complete, refactored backend foundation and a fully implemented "Meals" feature. You can follow this exact 
// service-oriented pattern (Model -> External Service -> Internal Service -> Controller -> Routes) to build out the 
// `workouts`, `calendar`, `dashboard`, and `chatbot` features. The structure is now clean, testable, and ready for expansion.