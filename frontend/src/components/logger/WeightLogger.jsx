// /frontend/src/components/logger/WeightLogger.jsx
import { useState } from "react";
import { logWeight } from "../../api";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Weight } from "lucide-react";

const WeightLogger = ({ onLogSuccess }) => {
  const [weight, setWeight] = useState("");
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const showFeedback = (message, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) {
      showFeedback("Please enter a valid weight.", true);
      return;
    }
    try {
      await logWeight({ weightKg: weight });
      showFeedback(`Weight of ${weight}kg logged successfully!`);
      setWeight("");
      onLogSuccess();
    } catch (error) {
      showFeedback(
        error.response?.data?.message || "Failed to log weight.",
        true
      );
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      {feedback.message && (
        <p
          className={`mb-4 font-semibold ${
            feedback.isError ? "text-danger" : "text-success"
          }`}
        >
          {feedback.message}
        </p>
      )}
      <h3 className="text-xl font-bold text-primary mb-4">Log Your Weight</h3>
      <p className="text-muted mb-4">
        Enter your current weight in kilograms (kg). This will update your
        profile and track your progress.
      </p>
      <form onSubmit={handleLogWeight} className="flex items-center gap-4">
        <Input
          type="number"
          placeholder="e.g., 75.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
        />
        <Button type="submit">
          <Weight size={16} className="mr-2" /> Log Weight
        </Button>
      </form>
    </div>
  );
};

export default WeightLogger;
