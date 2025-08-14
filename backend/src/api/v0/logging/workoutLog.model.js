import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true }, // e.g., "30 min run"
  durationMin: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true, default: 0 },
}, { timestamps: true });

workoutLogSchema.index({ user: 1, date: 1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;