import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodaySummary, getPerformanceReport } from '../api';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import TodayChart from '../components/charts/TodayChart';
import PerformanceChart from '../components/charts/PerformanceChart';
import { Flame, Droplets, Footprints, BarChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

const StatCard = ({ icon, title, value, unit, color }) => (
    <Card className="flex-1 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center">
            <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>{icon}</div>
            <div className="ml-4">
                <p className="text-sm text-muted font-medium">{title}</p>
                <p className="text-2xl font-bold text-primary">{value} <span className="text-lg font-medium text-muted">{unit}</span></p>
            </div>
        </div>
    </Card>
);

const Dashboard = () => {
    const { fitnessPlan, refetchData } = useAuth();
    const [summary, setSummary] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [performanceRange, setPerformanceRange] = useState('weekly');

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                // We refetch the summary to get today's latest logs
                const { data } = await getTodaySummary();
                setSummary(data);
            } catch (error) {
                console.error("Dashboard summary fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSummary();
    }, []);

    if (loading) return <Spinner size="lg" />;

    
    if (!fitnessPlan) {
        return (
            <Card className="text-center p-8 animate-fade-in-up">
                <h3 className="text-xl font-semibold text-primary">Welcome to your Dashboard!</h3>
                <p className="text-muted mt-2 mb-6">To get started, please create a fitness profile. This will unlock your personalized dashboard and allow you to track your progress.</p>
                <Link to="/profile">
                    <Button>Create Your Profile Now</Button>
                </Link>
            </Card>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2 animate-fade-in-up">Dashboard</h1>
            <p className="text-muted mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Welcome back, {user?.name?.split(' ')[0]}!</p>
            
            {/* **THE FIX IS HERE:** We check the hasPlan flag */}
            {!summary?.hasPlan ? (
                 <Card className="text-center p-8 animate-fade-in-up">
                    <h3 className="text-xl font-semibold text-primary">{summary?.message || "Get Started!"}</h3>
                    <p className="text-muted mt-2 mb-6">Create a fitness plan to unlock your personalized dashboard and start tracking your progress.</p>
                    <Link to="/profile">
                        <Button>Create Your Profile</Button>
                    </Link>
                 </Card>
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Flame className="text-red-500" />} title="Consumed" value={summary.caloriesConsumed} unit="kcal" color="bg-red-200" />
                <StatCard icon={<Footprints className="text-green-500" />} title="Burned" value={summary.caloriesBurned} unit="kcal" color="bg-green-200" />
                <StatCard icon={<BarChart className="text-blue-500" />} title="Calorie Goal" value={summary.calorieGoal} unit="kcal" color="bg-blue-200" />
                <StatCard icon={<Droplets className="text-cyan-500" />} title="Water Intake" value={`${summary.waterConsumed / 1000}`} unit="L" color="bg-cyan-200" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-primary mb-4">Today's Balance</h2>
                    <TodayChart data={summary} />
                </Card>
                <Card className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-primary">Performance</h2>
                        <div>
                            <select onChange={(e) => setPerformanceRange(e.target.value)} value={performanceRange} className="bg-light border-none rounded-md p-2 font-semibold text-sm focus:ring-2 focus:ring-secondary">
                                <option value="weekly">Last 7 Days</option>
                                <option value="monthly">This Month</option>
                            </select>
                        </div>
                    </div>
                    {performance ? <PerformanceChart data={performance} /> : <p className="text-muted">Log activities to see performance.</p>}
                </Card>
            </div>
            </>
            )}
        </div>
    );
};

export default Dashboard;