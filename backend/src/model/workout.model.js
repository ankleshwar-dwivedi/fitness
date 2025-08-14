// /backend/src/models/workout.model.js
import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true }, // UTC start of day
    exerciseName: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
});

workoutSchema.index({ user: 1, date: 1 }); // Index for faster queries

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;