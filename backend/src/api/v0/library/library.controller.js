import asyncHandler from '../../../utils/asyncHandler.js';
import Food from './food.model.js';
import Exercise from './exercise.model.js';

export const searchFoods = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const foods = await Food.find({ $text: { $search: q } }).limit(10);
    res.status(200).json(foods);
});

export const searchExercises = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const exercises = await Exercise.find({ $text: { $search: q } }).limit(10);
    res.status(200).json(exercises);
});