// /backend/src/api/v1/features/meals/meal.service.js
import Meal from '../../../../models/meal.model.js';
import User from '../../../../models/user.model.js';
import AppError from '../../../../utils/AppError.js';
import * as calorieService from '../../../../services/calorie.service.js';
import { normalizeDateToUTC } from '../../../../utils/dateUtils.js'; // We will create this file

/**
 * Adds a meal item (by querying for nutritional info) to a user's log for a specific date and meal type.
 * @param {string} userId - The user's ID.
 * @param {string} dateString - The date of the meal (e.g., "2024-08-15").
 * @param {string} mealType - e.g., "Breakfast", "Lunch".
 * @param {string} foodQuery - The food item(s) to look up, e.g., "1 slice of pizza".
 * @returns {Promise<object>} The updated or created meal document.
 */
export const addMealItemByQuery = async (userId, dateString, mealType, foodQuery) => {
    const nutritionalItems = await calorieService.getNutritionalInfo(foodQuery);
    if (nutritionalItems.length === 0) {
        throw new AppError(`Could not find nutritional information for "${foodQuery}". Please try a different query.`, 404);
    }

    const date = normalizeDateToUTC(dateString);

    // Calculate totals for the new items
    const totals = nutritionalItems.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        proteinG: acc.proteinG + item.proteinG,
        fatG: acc.fatG + item.fatG,
        carbsG: acc.carbsG + item.carbsG,
    }), { calories: 0, proteinG: 0, fatG: 0, carbsG: 0 });

    // Use findOneAndUpdate with upsert to create or update the meal log for the day
    const meal = await Meal.findOneAndUpdate(
        { user: userId, date, mealType },
        {
            $push: { items: { $each: nutritionalItems } },
            $inc: {
                totalCalories: totals.calories,
                totalProteinG: totals.proteinG,
                totalFatG: totals.fatG,
                totalCarbsG: totals.carbsG,
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // TODO: In a later step, we would call the calendar service here
    // calendarService.syncMealToCalendar(userId, meal);

    return meal;
};

/**
 * Retrieves all meal logs for a user on a specific date.
 * @param {string} userId - The user's ID.
 * @param {string} dateString - The date to retrieve meals for.
 * @returns {Promise<Array<object>>} An array of meal documents.
 */
export const getMealsByDate = async (userId, dateString) => {
    const date = normalizeDateToUTC(dateString);
    const meals = await Meal.find({ user: userId, date });
    return meals;
};

/**
 * Removes a specific food item from a meal log.
 * @param {string} userId - The user's ID.
 * @param {string} mealId - The ID of the meal document.
 * @param {string} itemId - The ID of the food item within the meal's 'items' array.
 * @returns {Promise<object>} The updated meal document.
 */
export const removeMealItem = async (userId, mealId, itemId) => {
    const meal = await Meal.findOne({ _id: mealId, user: userId });
    if (!meal) {
        throw new AppError('Meal log not found or you do not have permission to edit it.', 404);
    }

    const itemToRemove = meal.items.id(itemId);
    if (!itemToRemove) {
        throw new AppError('Food item not found in this meal log.', 404);
    }

    // Decrement the totals by the item's values
    meal.totalCalories -= itemToRemove.calories;
    meal.totalProteinG -= itemToRemove.proteinG;
    meal.totalFatG -= itemToRemove.fatG;
    meal.totalCarbsG -= itemToRemove.carbsG;

    // Remove the item from the array
    itemToRemove.remove(); // Mongoose subdocument removal

    // If no items are left, delete the entire meal document for cleanliness
    if (meal.items.length === 0) {
        await Meal.findByIdAndDelete(mealId);
        return { message: 'Meal log deleted as it is now empty.' };
    }

    await meal.save();
    return meal;
};