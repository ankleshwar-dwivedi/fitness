// /frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPerformanceReport } from '../api';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import PerformanceChart from '../components/charts/PerformanceChart';
import WeightChart from '../components/charts/WeightChart';
import WaterProgress from '../components/charts/WaterProgress';
import DailyProgressRings from '../components/charts/DailyProgressRings';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { Flame, Footprints, BarChart } from 'lucide-react';

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
    const { user, fitnessPlan, todaySummary, loading: authLoading } = useAuth();
    
    const [performance, setPerformance] = useState(null);
    const [loadingPerformance, setLoadingPerformance] = useState(true);
    const [chartView, setChartView] = useState('calories'); // 'calories' or 'weight'

    useEffect(() => {
        const fetchPerformance = async () => {
            if (!fitnessPlan) return; // Don't fetch if there's no plan
            setLoadingPerformance(true);
            try {
                // Forcing weekly for now as per user request focus
                const { data } = await getPerformanceReport('weekly');
                setPerformance(data);
            } catch (error) {
                console.error("Performance data fetch error", error);
                setPerformance(null);
            } finally {
                setLoadingPerformance(false);
            }
        };
        fetchPerformance();
    }, [fitnessPlan]);

    if (authLoading) return <Spinner size="lg" />;
    
    // This is the correct way to handle a user without a profile.
    if (!fitnessPlan || !todaySummary?.hasPlan) {
        return (
            <Card className="text-center p-8 max-w-lg mx-auto">
                <h2 className="text-3xl font-bold text-primary">Welcome, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-muted mt-2 mb-6">
                    To unlock your personalized dashboard and get your daily calorie target, please create your fitness profile.
                </p>
                <Link to="/profile"><Button>Create Your Profile</Button></Link>
            </Card>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-primary">Today's Dashboard</h1>
                    <p className="text-muted">Welcome back, {user?.name?.split(' ')[0]}!</p>
                </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Flame className="text-red-500" />} title="Consumed" value={todaySummary.caloriesConsumed} unit="kcal" color="bg-red-200" />
                <StatCard icon={<Footprints className="text-green-500" />} title="Burned" value={todaySummary.caloriesBurned} unit="kcal" color="bg-green-200" />
                <StatCard icon={<BarChart className="text-blue-500" />} title="Calorie Goal" value={todaySummary.calorieGoal} unit="kcal" color="bg-blue-200" />
            </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <Card>
                        <h2 className="text-2xl font-bold text-primary mb-4">Today's Balance</h2>
                        <DailyProgressRings summary={todaySummary} />
                    </Card>
                    <Card>
                        <WaterProgress consumed={todaySummary.waterConsumed} goal={todaySummary.waterGoal} />
                    </Card>
                </div>
                <Card>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-primary">Your Progress</h2>
                        <div className="flex gap-2 p-1 bg-light rounded-full">
                             <Button onClick={() => setChartView('calories')} className={`!px-3 !py-1 !text-sm ${chartView === 'calories' ? 'bg-secondary text-white' : 'bg-transparent !text-primary hover:bg-secondary/20'}`}>Calories</Button>
                             <Button onClick={() => setChartView('weight')} className={`!px-3 !py-1 !text-sm ${chartView === 'weight' ? 'bg-secondary text-white' : 'bg-transparent !text-primary hover:bg-secondary/20'}`}>Weight</Button>
                        </div>
                    </div>
                    {loadingPerformance ? <Spinner /> : (
                        performance ? (
                            <>
                                {chartView === 'calories' && <PerformanceChart data={performance} />}
                                {chartView === 'weight' && (
                                    (performance.weightHistory && performance.weightHistory.length > 0)
                                    ? <WeightChart data={performance.weightHistory} />
                                    : <p className="text-center text-muted py-10">Log your weight to see progress here.</p>
                                )}
                            </>
                        ) : <p className="text-muted text-center py-10">Log data to see your charts!</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;