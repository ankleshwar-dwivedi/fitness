import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  muscleGroup: { type: String, required: true }, // e.g., 'Chest', 'Back', 'Legs'
  equipment: { type: String }, // e.g., 'Barbell', 'Dumbbell', 'Bodyweight'
  metValue: { type: Number, required: true }, // Metabolic Equivalent of Task
  description: { type: String },
});

exerciseSchema.index({ name: 'text' });

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;