import { useEffect, useState, useCallback } from 'react';
import { upsertFitnessPlan } from '../api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth'; // Import the auth hook

const Profile = () => {
    const { fitnessPlan, setFitnessPlan } = useAuth(); // Get plan and setter from context
    
    // Initialize state with default values or from the context
    const getInitialState = useCallback(() => {
        if (fitnessPlan) {
            return {
                ...fitnessPlan,
                dateOfBirth: fitnessPlan.dateOfBirth ? new Date(fitnessPlan.dateOfBirth).toISOString().split('T')[0] : ''
            };
        }
        return {
            heightCm: '', weightKg: '', dateOfBirth: '', gender: 'male',
            activityLevel: 'sedentary', goal: 'maintain',
        };
    }, [fitnessPlan]);

    const [formData, setFormData] = useState(getInitialState);
    const [feedback, setFeedback] = useState('');

    // **THE FIX:** This useEffect now correctly syncs the form state if the context ever changes.
    useEffect(() => {
        setFormData(getInitialState());
    }, [fitnessPlan, getInitialState]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedPlan } = await upsertFitnessPlan(formData);
            setFitnessPlan(updatedPlan); // Update the global state
            setFeedback('Profile updated successfully!');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            setFeedback('Failed to update profile.');
        }
    };

    return (
        // ... The JSX for this component remains the same ...
        <div>
            <h1 className="text-4xl font-bold text-primary mb-6">Your Fitness Profile</h1>
            <Card className="max-w-2xl mx-auto">
                <p className="text-muted mb-4 text-center">Your profile helps us calculate your daily goals and generate personalized plans.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input name="heightCm" type="number" placeholder="Height (cm)" value={formData.heightCm} onChange={handleChange} required />
                        <Input name="weightKg" type="number" placeholder="Weight (kg)" value={formData.weightKg} onChange={handleChange} required />
                    </div>
                    <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                    </select>
                    <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-4 py-3 bg-light border border-gray-300 rounded-lg">
                        <option value="lose">Weight Loss</option>
                        <option value="maintain">Maintenance</option>
                        <option value="gain">Weight Gain</option>
                    </select>
                    <Button type="submit" className="w-full">Save Profile</Button>
                    {feedback && <p className="text-center text-success">{feedback}</p>}
                </form>
            </Card>
        </div>
    );
};

export default Profile;