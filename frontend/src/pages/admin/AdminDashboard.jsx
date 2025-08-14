import { useEffect, useState } from 'react';
import { getAdminDashboardStats } from '../../api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Users, FileText, Dumbbell, UserPlus } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => (
    <Card className="transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center">
            <div className={`p-4 rounded-lg bg-opacity-20 ${color}`}>{icon}</div>
            <div className="ml-4">
                <p className="text-lg font-semibold text-muted">{title}</p>
                <p className="text-4xl font-bold text-primary">{value}</p>
            </div>
        </div>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getAdminDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users className="text-blue-500" />} title="Total Users" value={stats?.totalUsers || 0} color="bg-blue-200" />
                <StatCard icon={<FileText className="text-green-500" />} title="Meal Logs" value={stats?.totalMealLogs || 0} color="bg-green-200" />
                <StatCard icon={<Dumbbell className="text-red-500" />} title="Workout Logs" value={stats?.totalWorkoutLogs || 0} color="bg-red-200" />
                <StatCard icon={<UserPlus className="text-indigo-500" />} title="New Users Today" value={stats?.newUsersToday || 0} color="bg-indigo-200" />
            </div>
        </div>
    );
};

export default AdminDashboard;