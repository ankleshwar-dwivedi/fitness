//backend/src/services/streaks.service.js
import User from '../api/v0/user/user.model.js';

const getStartOfDayUTC = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

export const updateStreaks = async (userId, logType) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = getStartOfDayUTC(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const streakField = logType === 'workout' ? 'currentWorkoutStreak' : 'currentDietStreak';
    const lastLogDateField = logType === 'workout' ? 'lastWorkoutLogDate' : 'lastDietLogDate';

    const lastLogDate = user.streaks[lastLogDateField] ? getStartOfDayUTC(user.streaks[lastLogDateField]) : null;

    if (lastLogDate && lastLogDate.getTime() === today.getTime()) {
        // Already logged today, do nothing
        return;
    }

    if (lastLogDate && lastLogDate.getTime() === yesterday.getTime()) {
        // Continued the streak
        user.streaks[streakField] += 1;
        user.credits += 10; // Award credits for continuing streak
    } else {
        // Reset or start the streak
        user.streaks[streakField] = 1;
        user.credits += 5; // Award credits for starting
    }

    user.streaks[lastLogDateField] = new Date();
    await user.save();
};