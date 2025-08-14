// /backend/src/models/meal.model.js
import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    servingSizeG: { type: Number, required: true, min: 0 },
    proteinG: { type: Number, min: 0, default: 0 },
    fatG: { type: Number, min: 0, default: 0 },
    carbsG: { type: Number, min: 0, default: 0 },
}, { _id: true }); // Use default _id for subdocuments to allow easy deletion

const mealSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // Should be stored as UTC start of day
    mealType: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    },
    items: [mealItemSchema],
    totalCalories: { type: Number, required: true, default: 0 },
    totalProteinG: { type: Number, required: true, default: 0 },
    totalFatG: { type: Number, required: true, default: 0 },
    totalCarbsG: { type: Number, required: true, default: 0 },
}, {
    timestamps: true,
});

// Ensure a user can only have one document per meal type per day
mealSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;