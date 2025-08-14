import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Should be normalized to start of day UTC
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  description: { type: String, required: true }, // e.g., "2 eggs and a slice of toast"
  calories: { type: Number, required: true, default: 0 },
  protein_g: { type: Number, default: 0 },
  carbohydrates_total_g: { type: Number, default: 0 },
  fat_total_g: { type: Number, default: 0 },
}, { timestamps: true });

// Index for efficient querying of a user's logs for a specific date
mealLogSchema.index({ user: 1, date: 1 });

const MealLog = mongoose.model('MealLog', mealLogSchema);
export default MealLog;