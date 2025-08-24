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

    const template = await WorkoutTemplate.findOne({
      goal: fitnessPlan.goal === "lose_weight" ? "lose_weight" : "gain_muscle",
      level: "beginner", // Simplified for now
    });
    if (!template)
      throw new AppError("No suitable workout template found.", 404);

    // Populate exercise names for easier display on frontend
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
          name: ex.exercise.name, // Denormalize name
          sets: ex.sets,
          reps: ex.reps,
        })),
      })),
    };

    // Upsert to avoid creating duplicate plans
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
    const mealTargets = {
      /* ... same targets ... */
    };

    const [breakfastFoods, mainCourseFoods, snackFoods, allFoods] =
      await Promise.all([
        Food.find({ tags: "breakfast" }).limit(20),
        Food.find({ tags: { $in: ["lunch", "dinner"] } }).limit(40),
        Food.find({ tags: "snack" }).limit(20),
        Food.find().limit(50), // **FALLBACK: Grab any food if tagged queries fail**
      ]);

    if (allFoods.length === 0) {
      throw new AppError(
        "The food library is empty. Please seed the database.",
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
