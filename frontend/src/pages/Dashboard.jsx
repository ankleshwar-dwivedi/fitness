import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerformanceReport } from '../api';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import TodayChart from '../components/charts/TodayChart';
import PerformanceChart from '../components/charts/PerformanceChart';
import WaterProgress from '../components/charts/WaterProgress';
import { Flame, Footprints, BarChart } from 'lucide-react';
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
    // FIX IS HERE: Get user, plan, and summary directly from context
    const { user, fitnessPlan, todaySummary, loading: authLoading } = useAuth();
    
    const [performance, setPerformance] = useState(null);
    const [loadingPerformance, setLoadingPerformance] = useState(true);
    const [performanceRange, setPerformanceRange] = useState('weekly');

    useEffect(() => {
        const fetchPerformance = async () => {
            if (!fitnessPlan) return;
            setLoadingPerformance(true);
            try {
                const { data } = await getPerformanceReport(performanceRange);
                setPerformance(data);
            } catch (error) {
                console.error("Performance data fetch error", error);
                setPerformance(null);
            } finally {
                setLoadingPerformance(false);
            }
        };
        fetchPerformance();
    }, [performanceRange, fitnessPlan]);

    // Use the authLoading flag from context
    if (authLoading) return <Spinner size="lg" />;
    
    if (!fitnessPlan || !todaySummary?.hasPlan) {
        return (
            <Card className="text-center p-8">
                <h3 className="text-xl font-semibold text-primary">Welcome to your Dashboard!</h3>
                <p className="text-muted mt-2 mb-6">To get started, please create a fitness profile to unlock your personalized dashboard.</p>
                <Link to="/profile"><Button>Create Your Profile</Button></Link>
            </Card>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
            <p className="text-muted mb-8">Welcome back, {user?.name?.split(' ')[0]}!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Flame className="text-red-500" />} title="Consumed" value={todaySummary.caloriesConsumed} unit="kcal" color="bg-red-200" />
                <StatCard icon={<Footprints className="text-green-500" />} title="Burned" value={todaySummary.caloriesBurned} unit="kcal" color="bg-green-200" />
                <StatCard icon={<BarChart className="text-blue-500" />} title="Calorie Goal" value={todaySummary.calorieGoal} unit="kcal" color="bg-blue-200" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <h2 className="text-2xl font-bold text-primary mb-4">Today's Balance</h2>
                        <TodayChart data={todaySummary} />
                    </Card>
                    <Card>
                        <WaterProgress consumed={todaySummary.waterConsumed} goal={todaySummary.waterGoal} />
                    </Card>
                </div>
                <Card className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-primary">Performance</h2>
                        <select onChange={(e) => setPerformanceRange(e.target.value)} value={performanceRange} className="bg-light border-none rounded-md p-2 font-semibold text-sm focus:ring-2 focus:ring-secondary">
                            <option value="weekly">Last 7 Days</option>
                            <option value="monthly">This Month</option>
                        </select>
                    </div>
                    {loadingPerformance ? <Spinner /> : (
                        performance && (performance.calorieConsumption.length > 0 || performance.calorieBurn.length > 0)
                            ? <PerformanceChart data={performance} />
                            : <p className="text-muted text-center py-10">Log some activities to see your performance chart!</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;