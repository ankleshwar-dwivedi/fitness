import asyncHandler from '../../../utils/asyncHandler.js';
import dashboardService from './dashboard.service.js';

export const getTodaySummary = asyncHandler(async (req, res, next) => {
  const summary = await dashboardService.generateTodaySummary(req.user.id);
  res.status(200).json(summary);
});

export const getPerformanceReport = asyncHandler(async (req, res, next) => {
  const { range } = req.query; // 'weekly' or 'monthly'
  const report = await dashboardService.generatePerformanceReport(req.user.id, range);
  res.status(200).json(report);
});