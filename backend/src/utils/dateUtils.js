// /backend/src/utils/dateUtils.js

/**
 * Takes a date string or Date object and normalizes it to the start of the day in UTC.
 * This ensures date comparisons are consistent regardless of server/user timezone.
 * @param {string | Date} dateInput - The date to normalize.
 * @returns {Date} A new Date object set to 00:00:00 UTC for the given date.
 */
export const normalizeDateToUTC = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date provided');
    }
    date.setUTCHours(0, 0, 0, 0);
    return date;
};