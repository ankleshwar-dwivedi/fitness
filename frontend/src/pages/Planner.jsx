import { useEffect, useState } from "react";
import { getMealPlan, getWorkoutPlan } from "../api";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import { Utensils, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

const Planner = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError("");
      try {
        const [mealRes, workoutRes] = await Promise.all([
          getMealPlan(),
          getWorkoutPlan(),
        ]);
        setMealPlan(mealRes.data);
        setWorkoutPlan(workoutRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not generate plans. Please ensure your profile is complete."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">
        AI-Generated Plans
      </h1>

      {error && (
        <Card>
          <p className="text-center text-danger p-4">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MEAL PLANNER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Utensils /> Your Weekly Meal Plan
            </h2>
            {mealPlan ? (
              <div className="space-y-4">
                <p className="text-sm text-center bg-light p-2 rounded-md">
                  Target:{" "}
                  <strong className="text-secondary">
                    {mealPlan.targetCalories} kcal/day
                  </strong>{" "}
                  | Generated:{" "}
                  <strong className="text-secondary">
                    {mealPlan.generatedCalories} kcal/day
                  </strong>
                </p>
                {/* **THE FIX IS HERE: Defensive rendering** */}
                {Object.entries(mealPlan.generatedPlan || {}).map(
                  ([day, meal]) =>
                    meal && (
                      <div key={day}>
                        <h3 className="font-bold capitalize text-lg text-secondary border-b-2 border-light pb-1 mb-2">
                          {day}
                        </h3>
                        <ul className="space-y-1 text-muted">
                          <li className="flex justify-between">
                            <span>
                              <strong>{meal.name}</strong>
                            </span>
                            <span>~{meal.calories} kcal</span>
                          </li>
                        </ul>
                      </div>
                    )
                )}
              </div>
            ) : (
              !error && (
                <p className="text-muted">Generating your meal plan...</p>
              )
            )}
          </Card>
        </motion.div>

        {/* WORKOUT PLANNER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Dumbbell /> Your Weekly Workout Plan
            </h2>
            {workoutPlan ? (
              <div className="space-y-4">
                {(workoutPlan.schedule || []).map((dayPlan) => (
                  <div key={dayPlan.day}>
                    <h3 className="font-bold capitalize text-lg text-secondary border-b-2 border-light pb-1 mb-2">
                      {dayPlan.focus} ({dayPlan.day})
                    </h3>
                    <ul className="space-y-2 text-muted">
                      {(dayPlan.exercises || []).map((ex, i) => (
                        <li key={i}>
                          <strong>{ex.name}:</strong> {ex.sets} sets of{" "}
                          {ex.reps} reps
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              !error && (
                <p className="text-muted">Generating your workout plan...</p>
              )
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Planner;
