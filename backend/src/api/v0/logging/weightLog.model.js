import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Normalized to start of day UTC
  weightKg: { type: Number, required: [true, 'Weight in kg is required.'] },
}, { timestamps: true });

// A user should only have one weight entry per day.
// If they update their weight, it should replace the old one for that day.
weightLogSchema.index({ user: 1, date: 1 }, { unique: true });

const WeightLog = mongoose.model('WeightLog', weightLogSchema);
export default WeightLog;