//frontend/src/components/logger/WorkoutLogger.jsx
import { useState } from "react";
import { logWorkout, searchExercises } from "../../api";
import Input from "../ui/Input";
import Button from "../ui/Button";
import SearchableSelect from "./SearchableSelect";
import { Dumbbell } from "lucide-react";

const WorkoutLogger = ({ onLogSuccess }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [performance, setPerformance] = useState({
    sets: "",
    reps: "",
    weightKg: "",
    durationMin: "",
  });
  const [logType, setLogType] = useState("strength");
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const showFeedback = (message, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleSearch = async (query) => {
    if (query.length < 2) return [];
    const { data } = await searchExercises(query);
    return data.map((ex) => ({ label: ex.name, value: ex._id }));
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!selectedExercise) {
      showFeedback("Please select an exercise.", true);
      return;
    }
    try {
      // *THIS FIX HERE: Build the performance data flexibly
      const perfData = {};
      const durationMin = parseInt(performance.durationMin, 10);
      if (!isNaN(durationMin) && durationMin > 0) {
        perfData.durationMin = durationMin;
      }

      if (logType === "strength") {
        const sets = parseInt(performance.sets, 10);
        const reps = parseInt(performance.reps, 10);
        const weightKg = parseInt(performance.weightKg, 10) || 0;

        if (isNaN(sets) || isNaN(reps) || sets <= 0 || reps <= 0) {
          showFeedback(
            "Sets and Reps are required for strength training.",
            true
          );
          return;
        }
        perfData.sets = Array(sets).fill({ reps, weightKg });
      }

      // *THIS FIX HERE: If perfData is empty, it means user submitted nothing for a cardio exercise
      if (Object.keys(perfData).length === 0) {
        showFeedback(
          "Please enter performance details (e.g., duration, sets, reps).",
          true
        );
        return;
      }

      await logWorkout({
        exerciseId: selectedExercise.value,
        performance: perfData,
      });
      showFeedback("Workout logged successfully!");
      setSelectedExercise(null);
      setPerformance({ sets: "", reps: "", weightKg: "", durationMin: "" });
      onLogSuccess();
    } catch (error) {
      showFeedback(
        error.response?.data?.message || "Failed to log workout.",
        true
      );
    }
  };

  return (
    <div>
      {feedback && (
        <p
          className={`mb-4 text-center font-semibold ${
            feedback.isError ? "text-danger" : "text-success"
          }`}
        >
          {feedback.message}
        </p>
      )}
      <form onSubmit={handleLogWorkout} className="max-w-lg mx-auto space-y-4">
        <SearchableSelect
          onSearch={handleSearch}
          value={selectedExercise}
          onChange={(selection) => {
            setSelectedExercise(selection);
            // Heuristic to guess log type
            setLogType(
              selection?.label.toLowerCase().includes("run") ||
                selection?.label.toLowerCase().includes("walk")
                ? "cardio"
                : "strength"
            );
          }}
          placeholder="Search for an exercise..."
        />

        {selectedExercise && (
          <>
            {logType === "strength" && (
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Sets*"
                  value={performance.sets}
                  onChange={(e) =>
                    setPerformance({ ...performance, sets: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Reps*"
                  value={performance.reps}
                  onChange={(e) =>
                    setPerformance({ ...performance, reps: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={performance.weightKg}
                  onChange={(e) =>
                    setPerformance({ ...performance, weightKg: e.target.value })
                  }
                />
              </div>
            )}
            <Input
              type="number"
              placeholder={
                logType === "cardio"
                  ? "Duration (min)*"
                  : "Optional: Duration (min)"
              }
              value={performance.durationMin}
              onChange={(e) =>
                setPerformance({ ...performance, durationMin: e.target.value })
              }
            />
          </>
        )}

        <Button type="submit" className="w-full" disabled={!selectedExercise}>
          <Dumbbell size={16} className="mr-2" /> Log Workout
        </Button>
      </form>
    </div>
  );
};

export default WorkoutLogger;
