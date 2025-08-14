import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Required only if not a Google user
    required: function() { return !this.googleId; },
    minlength: 8,
    select: false, // Do not send password in queries by default
  },
  passwordConfirm: {
    type: String,
    required: function() { return !this.googleId && this.isNew; },
    validate: {
      // This only works on CREATE and SAVE!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  dateOfBirth: {
    type: Date,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to not be unique
  },
  googleAccessToken: { type: String, select: false },
  googleRefreshToken: { type: String, select: false },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Do not save confirm password to DB
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;