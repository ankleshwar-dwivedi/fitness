// /backend/src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const statusSchema = new mongoose.Schema({
    height: { type: Number, min: 0, default: null }, // in cm
    weight: { type: Number, min: 0, default: null }, // in kg
    goalWeight: { type: Number, min: 0, default: null }, // in kg
    activityLevel: {
        type: String,
        enum: ['Sedentary', 'Lightly Active', 'Active', 'Very Active', null],
        default: null,
    },
    dailyCalorieGoal: { type: Number, min: 0, default: 2000 },
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 6, select: false },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
    dateOfBirth: { type: Date, required: true },
    googleId: { type: String, unique: true, sparse: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: statusSchema, default: () => ({}) },
    googleCalendar: {
        accessToken: String,
        refreshToken: String,
        expiryDate: Number,
        isAuthorized: { type: Boolean, default: false },
    },
    // For later integration with a viable fitness provider
    fitnessProvider: {
        providerName: String, // e.g., 'HealthConnect', 'Fitbit'
        accessToken: String,
        refreshToken: String,
        expiryDate: Number,
        isAuthorized: { type: Boolean, default: false },
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;