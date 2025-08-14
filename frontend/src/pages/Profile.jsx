import { useEffect, useState } from 'react';
import { getFitnessPlan, upsertFitnessPlan } from '../api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth'; // Import the auth hook


const Profile = () => {
    
    const { fitnessPlan, setFitnessPlan } = useAuth(); // Get plan and setter from context
    const [formData, setFormData] = useState({
        heightCm: '',
        weightKg: '',
        dateOfBirth: '',
        gender: 'male',
        activityLevel: 'sedentary',
        goal: 'maintain',
    });
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (fitnessPlan) {
            setFormData({
                ...fitnessPlan,
                dateOfBirth: fitnessPlan.dateOfBirth ? new Date(fitnessPlan.dateOfBirth).toISOString().split('T')[0] : ''
            });
        }
    }, [fitnessPlan]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedPlan } = await upsertFitnessPlan(formData);
            setFitnessPlan(updatedPlan); // **THE FIX: Update the global state**
            setFeedback('Profile updated successfully!');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback('Failed to update profile.');
        }
    };

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-6">Your Fitness Profile</h1>
            <Card className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input name="heightCm" type="number" placeholder="Height (cm)" value={formData.heightCm} onChange={handleChange} />
                        <Input name="weightKg" type="number" placeholder="Weight (kg)" value={formData.weightKg} onChange={handleChange} />
                    </div>
                    <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                            <option value="sedentary">Sedentary</option>
                            <option value="light">Lightly Active</option>
                            <option value="moderate">Moderately Active</option>
                            <option value="active">Active</option>
                            <option value="very_active">Very Active</option>
                        </select>
                    </div>
                    <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                        <option value="lose">Weight Loss</option>
                        <option value="maintain">Maintenance</option>
                        <option value="gain">Weight Gain</option>
                    </select>

                    <Button type="submit" className="w-full">Save Profile</Button>
                    {feedback && <p className="text-success text-center">{feedback}</p>}
                </form>
            </Card>
        </div>
    );
};

export default Profile;