import asyncHandler from '../../../utils/asyncHandler.js';
import waterService from './water.service.js';

export const addWaterLog = asyncHandler(async (req, res) => {
    // Expects amount in milliliters (e.g., a glass is 250ml)
    const { amount, date } = req.body;
    const waterLog = await waterService.addWater(req.user.id, amount, date);
    res.status(200).json(waterLog);
});

export const getWaterLogForDate = asyncHandler(async (req, res) => {
    const { date } = req.params;
    const waterLog = await waterService.getLogForDate(req.user.id, date);
    res.status(200).json(waterLog);
});