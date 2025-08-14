import { google } from 'googleapis';
import config from '../../config/index.js';
import AppError from '../../utils/AppError.js';
import User from '../../api/v0/user/user.model.js';

class GoogleApiService {
    
    // Gets an authorized OAuth2 client for a specific user
    async getAuthClientForUser(userId) {
        const user = await User.findById(userId).select('+googleRefreshToken');
        if (!user || !user.googleRefreshToken) {
            throw new AppError('User has not authorized Google services or refresh token is missing.', 403);
        }

        const oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );

        oauth2Client.setCredentials({
            refresh_token: user.googleRefreshToken,
        });

        return oauth2Client;
    }

    async createCalendarEvent(userId, eventDetails) {
        const { summary, description, startDateTime, endDateTime } = eventDetails;
        if (!summary || !startDateTime || !endDateTime) {
            throw new AppError('Summary, start, and end times are required for calendar events.', 400);
        }

        try {
            const auth = await this.getAuthClientForUser(userId);
            const calendar = google.calendar({ version: 'v3', auth });

            const event = {
                summary,
                description,
                start: { dateTime: startDateTime, timeZone: 'UTC' },
                end: { dateTime: endDateTime, timeZone: 'UTC' },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 10 },
                    ],
                },
            };

            const createdEvent = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            return createdEvent.data;
        } catch (error) {
            console.error('Failed to create Google Calendar event:', error.message);
            // Don't throw a fatal error, just log it, as this is a secondary feature
            return null;
        }
    }
}

export default new GoogleApiService();