import mongoose from 'mongoose';

const fitnessPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  heightCm: {
    type: Number,
    required: [true, 'Height in cm is required.'],
  },
  weightKg: {
    type: Number,
    required: [true, 'Weight in kg is required.'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required.'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required.'],
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    required: [true, 'Activity level is required.'],
  },
  goal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    required: [true, 'Your fitness goal is required.'],
  },
  // Calculated values
  bmr: { type: Number },
  tdee: { type: Number }, // Target daily calories
}, { timestamps: true });

// Pre-save hook to calculate BMR and TDEE
fitnessPlanSchema.pre('save', function(next) {
  const age = new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  let bmr = 0;

  // Harris-Benedict BMR Formula
  if (this.gender === 'male') {
    bmr = 88.362 + (13.397 * this.weightKg) + (4.799 * this.heightCm) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * this.weightKg) + (3.098 * this.heightCm) - (4.330 * age);
  }
  this.bmr = Math.round(bmr);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  let tdee = bmr * (activityMultipliers[this.activityLevel] || 1.2);

  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    gain: 500,
  };
  this.tdee = Math.round(tdee + (goalAdjustments[this.goal] || 0));

  next();
});

const FitnessPlan = mongoose.model('FitnessPlan', fitnessPlanSchema);
export default FitnessPlan;