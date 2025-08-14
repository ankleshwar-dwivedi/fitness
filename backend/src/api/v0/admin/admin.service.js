import User from '../user/user.model.js';
import MealLog from '../logging/mealLog.model.js';
import WorkoutLog from '../logging/workoutLog.model.js';
import AppError from '../../../utils/AppError.js';

class AdminService {
    async getDashboardStats() {
        const totalUsers = await User.countDocuments();
        const totalMealLogs = await MealLog.countDocuments();
        const totalWorkoutLogs = await WorkoutLog.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

        return { totalUsers, totalMealLogs, totalWorkoutLogs, newUsersToday };
    }

    async getAllUsers() {
        // Find all users and exclude the password field
        return await User.find().select('-password');
    }

    async deleteUserById(userIdToDelete, adminUserId) {
        if (userIdToDelete === adminUserId.toString()) {
            throw new AppError('Admins cannot delete their own account.', 400);
        }
        await User.findByIdAndDelete(userIdToDelete);
        // In a real app, you'd also delete all associated logs.
    }

    async changeUserPassword(userId, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new AppError('Password must be at least 6 characters long.', 400);
        }
        const user = await User.findById(userId);
        if (!user) throw new AppError('User not found.', 404);
        
        user.password = newPassword;
        await user.save(); // The pre-save hook in user.model.js will hash it
    }
}

export default new AdminService();