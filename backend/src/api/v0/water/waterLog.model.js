import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Normalized to start of day UTC
  // We store total glasses/liters for the day, not individual entries
  amount: {
    type: Number,
    required: true,
    default: 0, // Amount in milliliters
  },
}, { timestamps: true });

// A user can only have one water log document per day
waterLogSchema.index({ user: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model('WaterLog', waterLogSchema);
export default WaterLog;