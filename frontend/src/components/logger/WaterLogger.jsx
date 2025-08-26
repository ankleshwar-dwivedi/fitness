import { useState } from "react";
import { logWater } from "../../api";
import Button from "../ui/Button";
import { GlassWater } from "lucide-react";

const quickAddAmounts = [250, 500, 750, 1000]; // in ml

// FIX IS HERE: Accept `onLogSuccess` as a prop
const WaterLogger = ({ onLogSuccess }) => {
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const showFeedback = (message, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: "", isError: false }), 3000);
  };

  const handleLogWater = async (amount) => {
    try {
      await logWater({ amount });
      showFeedback(`${amount}ml of water logged!`);
      onLogSuccess(); // This will now work correctly
    } catch (error) {
      showFeedback("Failed to log water.", true);
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
      <h3 className="text-xl font-bold text-primary mb-4">Quick Add Water</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickAddAmounts.map((amount) => (
          <Button
            key={amount}
            onClick={() => handleLogWater(amount)}
            className="w-full flex flex-col items-center !rounded-xl !py-4"
          >
            <GlassWater size={24} className="mb-2" />
            {amount} ml
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WaterLogger;
