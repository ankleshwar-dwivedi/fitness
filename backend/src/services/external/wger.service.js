import axios from 'axios';
import AppError from '../../utils/AppError.js';

// wger API is free and open-source, no key needed.
class WgerService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://wger.de/api/v2',
    });
  }

  // Gets a list of exercises for a specific muscle group
  async getExercisesByMuscle(muscleId = 1) { // 1 = Biceps
    try {
      const response = await this.api.get(`/exercise/?muscles=${muscleId}&language=2`); // 2 = English
      return response.data.results.map(ex => ({
          name: ex.name,
          description: ex.description.replace(/<[^>]*>?/gm, '') // Strip HTML tags
      }));
    } catch (error) {
      console.error('WGER API Error:', error.message);
      throw new AppError('Failed to fetch exercises from wger.', 502);
    }
  }

  // Generates a sample weekly workout plan
  async generateWorkoutPlan() {
    // In a real app, you'd fetch for different muscle groups based on user goals
    const [chest, back, legs] = await Promise.all([
        this.getExercisesByMuscle(4), // Chest
        this.getExercisesByMuscle(12), // Back
        this.getExercisesByMuscle(10), // Legs
    ]);

    const plan = {
        monday: { day: 'Chest Day', exercises: chest.slice(0, 3).map(e => ({...e, sets: '3', reps: '10-12'}))},
        wednesday: { day: 'Back Day', exercises: back.slice(0, 3).map(e => ({...e, sets: '3', reps: '10-12'}))},
        friday: { day: 'Leg Day', exercises: legs.slice(0, 3).map(e => ({...e, sets: '3', reps: '10-12'}))},
    };

    return plan;
  }
}

export default new WgerService();