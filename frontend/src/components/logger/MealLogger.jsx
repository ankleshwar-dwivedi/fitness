import { useState } from "react";
import { logMeal } from "../../api";
import FoodSearch from "./FoodSearch";
import Button from "../ui/Button";
import { Utensils, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MealLogger = ({ onLogSuccess }) => {
  const [mealItems, setMealItems] = useState([]);
  const [mealType, setMealType] = useState("breakfast");
  const [feedback, setFeedback] = useState("");

  const showFeedback = (message, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

    const addFoodToMeal = (food) => {
        // **THE FIX: Ensure the selected food has an ID**
        if (!food || !food._id) {
            showFeedback("Could not add selected food. Please try again.", true);
            return;
        }
        const quantity = parseInt(prompt(`Enter quantity for ${food.name} (in grams):`), 10);
        if (!isNaN(quantity) && quantity > 0) {
            const uniqueKey = `${food._id}-${Date.now()}`;
            // Use food._id directly for foodId to be safe
            setMealItems([...mealItems, { ...food, quantity, foodId: food._id, uniqueKey }]);
        }
    };

  const removeFoodFromMeal = (keyToRemove) => {
    setMealItems(mealItems.filter((item) => item.uniqueKey !== keyToRemove));
  };

  const handleLogMeal = async () => {
    if (mealItems.length === 0) return;
    try {
      const itemsToLog = mealItems.map(({ foodId, quantity }) => ({
        foodId,
        quantity,
      }));

      // **THE FIX IS HERE:** The key must be `items`, not `itemsToLog`.
      await logMeal({ items: itemsToLog, mealType: mealType });

      showFeedback("Meal logged successfully!");
      setMealItems([]);
      onLogSuccess();
    } catch (error) {
      showFeedback(
        error.response?.data?.message || "Failed to log meal.",
        true
      );
    }
  };

  const totalCalories = mealItems.reduce(
    (sum, item) => sum + (item.calories * item.quantity) / 100,
    0
  );

  return (
    <div>
      {feedback.message && (
        <p
          className={`mb-4 text-center font-semibold ${
            feedback.isError ? "text-danger" : "text-success"
          }`}
        >
          {feedback.message}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">1. Find Foods</h3>
          <FoodSearch onFoodSelect={addFoodToMeal} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary mb-4">
            2. Build & Log Meal
          </h3>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-3 mb-4 bg-light border-2 border-transparent rounded-lg focus:ring-2 focus:ring-secondary"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <div className="bg-light p-4 rounded-lg min-h-[150px] space-y-2">
            <AnimatePresence>
              {mealItems.length > 0 ? (
                mealItems.map((item) => (
                  <motion.div
                    key={item.uniqueKey}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted">
                        {item.quantity}g -{" "}
                        {Math.round((item.calories * item.quantity) / 100)} kcal
                      </p>
                    </div>
                    <button
                      onClick={() => removeFoodFromMeal(item.uniqueKey)}
                      className="text-danger p-1 rounded-full hover:bg-danger/10"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted text-center pt-12">
                  Add foods from the search bar
                </p>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold">
              Total: {Math.round(totalCalories)} kcal
            </p>
            <Button onClick={handleLogMeal} disabled={mealItems.length === 0}>
              <Utensils size={16} className="mr-2" /> Log Meal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealLogger;
