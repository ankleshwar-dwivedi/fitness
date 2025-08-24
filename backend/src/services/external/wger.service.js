import axios from 'axios';
import AppError from '../../utils/AppError.js';

class WgerService {
  constructor() {
    this.api = axios.create({    baseURL: 'https://wger.de/api/v2',
    headers: {
      Authorization: 'Token a7c76e0bb6f2b32e1d90dd605064f3f41f449134',
    }
    });
  }

  async getExercisesForMuscles(muscleIds = [], limit = 3) {
    try {
      const response = await this.api.get('/exercise/', {
        params: {
          muscles: muscleIds.join(','),
          language: 2, // English
          limit: limit * muscleIds.length // Fetch enough for variety
        }
      });
      // Sanitize HTML from descriptions
      return response.data.results.map(ex => ({
          id: ex.id,
          name: ex.name,
          description: ex.description.replace(/<[^>]*>?/gm, '').trim()
      }));
    } catch (error) {
      console.error('WGER API Error:', error.message);
      throw new AppError('Failed to fetch exercises from our provider.', 502);
    }
  }

  // Generates a structured 3-day split workout plan
  async generateWorkoutPlan() {
    const pushMuscles = [4, 2, 5]; // Chest, Shoulders, Triceps
    const pullMuscles = [12, 1, 13]; // Back, Biceps, Forearms
    const legMuscles = [10, 11, 7]; // Quads, Hamstrings, Calves

    const [pushExercises, pullExercises, legExercises] = await Promise.all([
      this.getExercisesForMuscles(pushMuscles, 2), // Get 2 exercises for each push muscle
      this.getExercisesForMuscles(pullMuscles, 2),
      this.getExercisesForMuscles(legMuscles, 2)
    ]);

    const createDayPlan = (exercises) => exercises.slice(0, 4).map(e => ({...e, sets: '3', reps: '10-12'}));

    return {
        monday: { day: 'Push Day (Chest, Shoulders, Triceps)', exercises: createDayPlan(pushExercises)},
        wednesday: { day: 'Pull Day (Back & Biceps)', exercises: createDayPlan(pullExercises)},
        friday: { day: 'Leg Day', exercises: createDayPlan(legExercises)},
    };
  }
}

export default new WgerService();