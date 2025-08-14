import { useState } from 'react';
import { logMeal, logWorkout, logWater } from '../api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Utensils, Dumbbell, GlassWater } from 'lucide-react';
import { motion } from 'framer-motion';

const Logger = () => {
    const [meal, setMeal] = useState({ description: '' });
    const [workout, setWorkout] = useState({ description: '', durationMin: '' });
    const [water, setWater] = useState({ amount: '' });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    };

    const handleMealSubmit = async (e) => { e.preventDefault(); try { await logMeal(meal); showFeedback('success', 'Meal logged!'); setMeal({ description: '' }); } catch (error) { showFeedback('error', 'Failed to log meal.'); } };
    const handleWorkoutSubmit = async (e) => { e.preventDefault(); try { await logWorkout({ ...workout, durationMin: parseInt(workout.durationMin) }); showFeedback('success', 'Workout logged!'); setWorkout({ description: '', durationMin: '' }); } catch (error) { showFeedback('error', 'Failed to log workout.'); } };
    const handleWaterSubmit = async (e) => { e.preventDefault(); try { await logWater({ amount: parseInt(water.amount) }); showFeedback('success', `${water.amount}ml water logged!`); setWater({ amount: '' }); } catch (error) { showFeedback('error', 'Failed to log water.'); } };

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">Log Your Day</h1>
            
            {feedback.message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}
                >
                    {feedback.message}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2"><Utensils /> Log a Meal</h2>
                    <form onSubmit={handleMealSubmit} className="space-y-4">
                        <Input placeholder="e.g., Chicken salad" value={meal.description} onChange={(e) => setMeal({ ...meal, description: e.target.value })} />
                        <Button type="submit" className="w-full">Log Meal</Button>
                    </form>
                </Card>
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2"><Dumbbell /> Log a Workout</h2>
                    <form onSubmit={handleWorkoutSubmit} className="space-y-4">
                        <Input placeholder="e.g., Morning run" value={workout.description} onChange={(e) => setWorkout({ ...workout, description: e.target.value })} />
                        <Input type="number" placeholder="Duration in minutes" value={workout.durationMin} onChange={(e) => setWorkout({ ...workout, durationMin: e.target.value })} />
                        <Button type="submit" className="w-full">Log Workout</Button>
                    </form>
                </Card>
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2"><GlassWater /> Log Water</h2>
                    <form onSubmit={handleWaterSubmit} className="space-y-4">
                        <Input type="number" placeholder="Amount in ml" value={water.amount} onChange={(e) => setWater({ ...water, amount: e.target.value })} />
                        <Button type="submit" className="w-full">Log Water</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Logger;