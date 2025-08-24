import mongoose from 'mongoose';

const userWorkoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutTemplate' },
  goal: String,
  level: String,
  
  // A copy of the schedule, so changes to the template don't affect existing user plans
  schedule: [{
    day: String,
    focus: String,
    exercises: [{
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      name: String, // Denormalized for easy display
      sets: Number,
      reps: String,
    }],
  }],
}, { timestamps: true });

const UserWorkoutPlan = mongoose.model('UserWorkoutPlan', userWorkoutPlanSchema);
export default UserWorkoutPlan;