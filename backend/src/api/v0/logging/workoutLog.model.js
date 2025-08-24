import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  
  // Replaces free-text `description` with a reference to our library
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },

  // Captures detailed performance for progressive overload tracking
  performance: {
    // For strength exercises
    sets: [{
      reps: { type: Number },
      weightKg: { type: Number },
    }],
    // For cardio exercises
    durationMin: { type: Number },
  },
  
  // Calculated value
  caloriesBurned: { type: Number, required: true, default: 0 },
}, { timestamps: true });

workoutLogSchema.index({ user: 1, date: 1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;