import { useState } from "react";
import Card from "../components/ui/Card";
import { Utensils, Dumbbell, GlassWater } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MealLogger from "../components/logger/MealLogger";
import WorkoutLogger from "../components/logger/WorkoutLogger";
import WaterLogger from "../components/logger/WaterLogger";
import { useAuth } from "../hooks/useAuth";

const tabs = [
  { id: "meal", label: "Log Meal", icon: <Utensils /> },
  { id: "workout", label: "Log Workout", icon: <Dumbbell /> },
  { id: "water", label: "Log Water", icon: <GlassWater /> },
];

const Logger = () => {
  const [activeTab, setActiveTab] = useState("meal");
  const { refetchData } = useAuth(); // Get refetch function from context

  // This function will be passed to children to trigger a dashboard update
  const onLogSuccess = () => {
    refetchData();
  };

  return (
    <div>
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
            {activeTab === "meal" && <MealLogger onLogSuccess={onLogSuccess} />}
            {activeTab === "workout" && (
              <WorkoutLogger onLogSuccess={onLogSuccess} />
            )}
            {activeTab === "water" && (
              <WaterLogger onLogSuccess={onLogSuccess} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default Logger;
