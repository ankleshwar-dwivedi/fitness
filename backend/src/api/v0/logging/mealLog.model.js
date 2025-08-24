import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  
  // Replaces free-text `description` with a structured format
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true }, // In grams or units
  }],
  
  // Calculated totals for the entire meal
  totalCalories: { type: Number, required: true },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
}, { timestamps: true });

mealLogSchema.index({ user: 1, date: 1 });

const MealLog = mongoose.model('MealLog', mealLogSchema);
export default MealLog;