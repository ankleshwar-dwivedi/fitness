import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner"; // Import Spinner
import { Utensils, Dumbbell, GlassWater, Weight } from "lucide-react"; // Add Weight icon
import { motion, AnimatePresence } from "framer-motion";
import MealLogger from "../components/logger/MealLogger";
import WorkoutLogger from "../components/logger/WorkoutLogger";
import WaterLogger from "../components/logger/WaterLogger";
import { useAuth } from "../hooks/useAuth";
import WeightLogger from "../components/logger/WeightLogger"; // Import new component for weight feature

const tabs = [
  { id: "meal", label: "Log Meal", icon: <Utensils /> },
  { id: "workout", label: "Log Workout", icon: <Dumbbell /> },
  { id: "water", label: "Log Water", icon: <GlassWater /> },
  { id: "weight", label: "Log Weight", icon: <Weight /> }, // NEW: Add weight tab
];

const Logger = () => {
  const [activeTab, setActiveTab] = useState("meal");
  const { refetchData } = useAuth();
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false); // FIX IS HERE: Add loading state

  const handleLogSuccess = async () => {
    setIsLogging(true); // Show loading overlay
    await refetchData(); // Wait for all data to be refreshed
    setIsLogging(false); // Hide overlay
    navigate("/dashboard"); // Navigate AFTER data is fresh
  };

  return (
    <div>
      {/* FIX IS HERE: Loading overlay */}
      {isLogging && (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
          <Spinner size="lg" />
          <p className="mt-4 font-semibold text-primary">
            Updating Your Dashboard...
          </p>
        </div>
      )}

      <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">
        Log Your Day
      </h1>

      <div className="mb-6 flex border-b-2 border-light space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-2 font-semibold transition-colors relative ${
              activeTab === tab.id
                ? "text-secondary"
                : "text-muted hover:text-primary"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-secondary"
                layoutId="underline"
              />
            )}
          </button>
        ))}
      </div>

      <Card>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "meal" && (
              <MealLogger onLogSuccess={handleLogSuccess} />
            )}
            {activeTab === "workout" && (
              <WorkoutLogger onLogSuccess={handleLogSuccess} />
            )}
            {activeTab === "water" && (
              <WaterLogger onLogSuccess={handleLogSuccess} />
            )}
            {activeTab === "weight" && (
              <WeightLogger onLogSuccess={handleLogSuccess} />
            )}{" "}
            {/* Finally NEW Feature: Render weight component */}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default Logger;
