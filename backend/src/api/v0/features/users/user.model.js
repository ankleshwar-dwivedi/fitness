// /backend/src/api/v1/features/users/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        required: false,
        minlength: 6,
        select: false, // Do not send password in query results by default
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    // Embedded document for fitness status
    status: {
        height: { type: Number, min: 0 }, // in cm
        weight: { type: Number, min: 0 }, // in kg
        goalWeight: { type: Number, min: 0 }, // in kg
        activityLevel: {
            type: String,
            enum: ['Sedentary', 'Lightly Active', 'Active', 'Very Active'],
        },
        goal: {
            type: String,
            enum: ['Maintenance', 'Cutting', 'Bulking'],
        },
    },
    googleCalendar: {
        accessToken: String,
        refreshToken: String,
        expiryDate: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual property for age
userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    // We need to explicitly select the password field from the DB first
    const userWithPassword = await mongoose.model('User').findById(this._id).select('+password');
    return await bcrypt.compare(enteredPassword, userWithPassword.password);
};

const User = mongoose.model('User', userSchema);

export default User;