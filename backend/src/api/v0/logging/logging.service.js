import MealLog from './mealLog.model.js';
import WorkoutLog from './workoutLog.model.js';
import WaterLog from '../water/waterLog.model.js';
import calorieService from '../../../services/external/calorie.service.js';
import workoutService from '../../../services/external/workout.service.js';
import googleService from '../../../services/external/google.service.js';

// Helper to normalize date to the start of the day in UTC
const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date;
};


class LoggingService {
  async createMealLog(userId, description, mealType, dateStr) {
    const nutrition = await calorieService.getNutritionalInfo(description);
    const date = normalizeDate(dateStr || new Date());
    
    const mealLog = await MealLog.create({
      user: userId,
      date,
      description,
      mealType,
      ...nutrition
    });

    // Fire-and-forget calendar event
    const eventStartTime = new Date(date);
    // You could set specific times for meals
    googleService.createCalendarEvent(userId, {
        summary: `Meal: ${description}`,
        description: `Logged ${mealLog.calories} calories.`,
        startDateTime: eventStartTime.toISOString(),
        endDateTime: new Date(eventStartTime.getTime() + 30 * 60000).toISOString(), // 30 min duration
    }).catch(err => console.error("Non-fatal: Could not create calendar event for meal."));

    return mealLog;
  }

  async createWorkoutLog(userId, description, durationMin, dateStr) {
    const fullActivity = `${durationMin} min ${description}`;
    const caloriesBurned = await workoutService.getCaloriesBurned(fullActivity);
    const date = normalizeDate(dateStr || new Date());

    const workoutLog = await WorkoutLog.create({
      user: userId,
      date,
      description,
      durationMin,
      caloriesBurned: Math.round(caloriesBurned),
    });

    // Fire-and-forget calendar event
    const eventStartTime = new Date(date);
     googleService.createCalendarEvent(userId, {
        summary: `Workout: ${description}`,
        description: `Burned ${workoutLog.caloriesBurned} calories in ${durationMin} minutes.`,
        startDateTime: eventStartTime.toISOString(),
        endDateTime: new Date(eventStartTime.getTime() + durationMin * 60000).toISOString(),
    }).catch(err => console.error("Non-fatal: Could not create calendar event for workout."));


    return workoutLog;
  }
async createWaterLog(userId, amount, dateStr) {
        const date = normalizeDate(dateStr || new Date());
        const waterLog = await WaterLog.create({
            user: userId,
            date,
            amount: parseInt(amount, 10),
        });
        return waterLog;
    }

    async getDailyLogs(userId, dateStr) {
        const date = normalizeDate(dateStr);
        const [meals, workouts, water] = await Promise.all([
            MealLog.find({ user: userId, date }),
            WorkoutLog.find({ user: userId, date }),
            WaterLog.find({ user: userId, date }),
        ]);
        const totalWater = water.reduce((sum, log) => sum + log.amount, 0);
        return { meals, workouts, water: { logs: water, total: totalWater } };
    }

}

export default new LoggingService();