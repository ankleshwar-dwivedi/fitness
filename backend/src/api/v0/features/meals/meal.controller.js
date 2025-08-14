// /backend/src/api/v1/features/meals/meal.controller.js
import * as mealService from './meal.service.js';

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const addMeal = asyncHandler(async (req, res) => {
    const { date, mealType, query } = req.body;
    const userId = req.user._id;

    if (!date || !mealType || !query) {
        return res.status(400).json({ message: 'Please provide date, mealType, and a food query.' });
    }

    const meal = await mealService.addMealItemByQuery(userId, date, mealType, query);
    res.status(201).json(meal);
});

export const getMeals = asyncHandler(async (req, res) => {
    const { date } = req.params;
    const userId = req.user._id;

    if (!date) {
        return res.status(400).json({ message: 'Please provide a date.' });
    }

    const meals = await mealService.getMealsByDate(userId, date);
    res.status(200).json(meals);
});

export const deleteMealItem = asyncHandler(async (req, res) => {
    const { mealId, itemId } = req.params;
    const userId = req.user._id;

    const result = await mealService.removeMealItem(userId, mealId, itemId);
    res.status(200).json(result);
});