// /backend/src/api/v0/planners/planners.service.js
import UserWorkoutPlan from "./userWorkoutPlan.model.js";
import WorkoutTemplate from "./workoutTemplate.model.js";
import FitnessPlan from "../fitness/fitness.model.js";
import Food from "../library/food.model.js";
import AppError from "../../../utils/AppError.js";

class PlannerService {
  async generateUserWorkoutPlan(userId) {
    const fitnessPlan = await FitnessPlan.findOne({ user: userId });
    if (!fitnessPlan)
      throw new AppError("User fitness profile is required.", 400);

    const goalMap = {
      lose: "lose_weight",
      gain: "gain_muscle",
      maintain: "gain_muscle", // Default to muscle gain for maintenance
    };

    const template = await WorkoutTemplate.findOne({
      goal: goalMap[fitnessPlan.goal] || "gain_muscle",
      level: "beginner", // Simplified for now
    });

    if (!template)
      throw new AppError(
        "No suitable workout template found. Please ensure the database is seeded.",
        404
      );

    await template.populate("schedule.exercises.exercise");

    const planData = {
      user: userId,
      template: template._id,
      goal: template.goal,
      level: template.level,
      schedule: template.schedule.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ({
          exercise: ex.exercise._id,
          name: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
        })),
      })),
    };

    return await UserWorkoutPlan.findOneAndUpdate({ user: userId }, planData, {
      new: true,
      upsert: true,
    });
  }

  async generateUserMealPlan(userId) {
    const fitnessPlan = await FitnessPlan.findOne({ user: userId });
    if (!fitnessPlan)
      throw new AppError("User fitness profile is required.", 400);

    const calorieGoal = fitnessPlan.tdee;

    // **THE FIX IS HERE:** We add a filter to ensure calories are a valid number > 0.
    // This prevents any malformed data in the database from causing a crash.
    const validFoodFilter = {
      calories: { $exists: true, $type: "number", $gt: 0 },
    };

    const [breakfastFoods, mainCourseFoods, snackFoods, allFoods] =
      await Promise.all([
        Food.find({ tags: "breakfast", ...validFoodFilter }).limit(20),
        Food.find({
          tags: { $in: ["lunch", "dinner"] },
          ...validFoodFilter,
        }).limit(40),
        Food.find({ tags: "snack", ...validFoodFilter }).limit(20),
        Food.find(validFoodFilter).limit(50), // Fallback uses only valid foods
      ]);

    if (allFoods.length === 0) {
      throw new AppError(
        "The food library has no valid entries. Please seed the database.",
        500
      );
    }

    const pickRandom = (arr) =>
      arr.length > 0
        ? arr[Math.floor(Math.random() * arr.length)]
        : allFoods[Math.floor(Math.random() * allFoods.length)];

    const generatedPlan = {
      breakfast: pickRandom(breakfastFoods),
      lunch: pickRandom(mainCourseFoods),
      dinner: pickRandom(mainCourseFoods),
      snack: pickRandom(snackFoods),
    };

    // This calculation is now safe because we filtered out invalid data.
    const totalCalories = Object.values(generatedPlan).reduce(
      (sum, meal) => sum + (meal?.calories || 0),
      0
    );

    return {
      targetCalories: calorieGoal,
      generatedCalories: totalCalories,
      generatedPlan,
      info: "This is a sample plan based on your goals.",
    };
  }
}

export default new PlannerService();
