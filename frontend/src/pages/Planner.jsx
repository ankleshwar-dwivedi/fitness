import { useEffect, useState } from 'react';
import { getMealPlan, getWorkoutPlan } from '../api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Utensils, Dumbbell } from 'lucide-react';

const Planner = () => {
    const [mealPlan, setMealPlan] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch in parallel for a faster experience
                const [mealRes, workoutRes] = await Promise.all([getMealPlan(), getWorkoutPlan()]);
                setMealPlan(mealRes.data);
                setWorkoutPlan(workoutRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Could not generate plans. Please ensure your profile is complete.");
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">AI-Generated Plans</h1>
            
            {error && <Card><p className="text-center text-danger">{error}</p></Card>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3"><Utensils /> Your Weekly Meal Plan</h2>
                    {mealPlan ? (
                        <div className="space-y-4">
                            <p className="text-sm text-center bg-light p-2 rounded-md">Target: <strong>{mealPlan.targetCalories} kcal/day</strong>. {mealPlan.info}</p>
                            {Object.entries(mealPlan.plan).map(([day, meals]) => (
                                <div key={day}>
                                    <h3 className="font-bold capitalize text-lg text-secondary border-b-2 border-light pb-1 mb-2">{day}</h3>
                                    <ul className="space-y-1 text-muted">
                                        {meals.map((item, i) => <li key={i} className="flex justify-between"><span><strong>{item.meal}:</strong> {item.description}</span> <span>~{item.calories} kcal</span></li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : !error && <p className="text-muted">Generating your meal plan...</p>}
                </Card>
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3"><Dumbbell /> Your Weekly Workout Plan</h2>
                    {workoutPlan ? (
                         <div className="space-y-4">
                            {Object.entries(workoutPlan).map(([day, details]) => (
                                <div key={day}>
                                    <h3 className="font-bold capitalize text-lg text-secondary border-b-2 border-light pb-1 mb-2">{details.day}</h3>
                                    <ul className="space-y-2 text-muted">
                                        {details.exercises.map((ex, i) => <li key={i}><strong>{ex.name}:</strong> {ex.sets} sets of {ex.reps} reps</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : !error && <p className="text-muted">Generating your workout plan...</p>}
                </Card>
            </div>
        </div>
    );
};

export default Planner;