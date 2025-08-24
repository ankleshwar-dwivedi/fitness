import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Per 100g serving
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  servingUnit: { type: String, default: 'g' },
  // Tags for easier meal plan generation
  tags: [String], // e.g., ['breakfast', 'snack', 'high-protein']
});

// Create a text index on the name for fast searching
foodSchema.index({ name: 'text' });

const Food = mongoose.model('Food', foodSchema);
export default Food;