import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },

  performance: {
    sets: [{
      reps: { type: Number },
      weightKg: { type: Number },
    }],
    durationMin: { type: Number },
  },
  
  caloriesBurned: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// *This FIX IS HERE: The incorrect unique index has been removed.
// We only need to index for performance.
workoutLogSchema.index({ user: 1, date: 1 });

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);
export default WorkoutLog;