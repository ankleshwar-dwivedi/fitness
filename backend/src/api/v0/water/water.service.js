import WaterLog from './waterLog.model.js';

// Helper to normalize date to the start of the day in UTC
const normalizeDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date;
};

class WaterService {
    async addWater(userId, amount, dateStr) {
        const date = normalizeDate(dateStr);

        const waterLog = await WaterLog.findOneAndUpdate(
            { user: userId, date: date },
            // Use $inc to add to the existing amount. This is atomic.
            { $inc: { amount: amount } },
            // new: true returns the modified document
            // upsert: true creates the document if it doesn't exist
            { new: true, upsert: true, runValidators: true }
        );
        return waterLog;
    }
    
    async getLogForDate(userId, dateStr) {
        const date = normalizeDate(dateStr);
        const log = await WaterLog.findOne({ user: userId, date: date });
        // If no log exists for the day, return a default 0 value
        return log || { user: userId, date: date, amount: 0 };
    }
}

export default new WaterService();