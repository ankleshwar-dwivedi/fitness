import mongoose from 'mongoose';

const workoutTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goal: { type: String, enum: ['lose_weight', 'gain_muscle', 'maintenance'], required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  
  schedule: [{
    day: { type: String }, // e.g., 'Monday', 'Day 1'
    focus: { type: String }, // e.g., 'Chest & Triceps'
    exercises: [{
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      sets: { type: Number },
      reps: { type: String }, // e.g., "8-12"
    }],
  }],
});

const WorkoutTemplate = mongoose.model('WorkoutTemplate', workoutTemplateSchema);
export default WorkoutTemplate;