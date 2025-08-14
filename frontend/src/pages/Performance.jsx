import { useEffect, useState } from 'react';
import { getPerformanceReport } from '../api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import PerformanceChart from '../components/charts/PerformanceChart';

const Performance = () => {
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('weekly');

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const { data } = await getPerformanceReport(range);
                setPerformance(data);
            } catch (error) {
                console.error("Failed to fetch performance report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [range]);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-primary">Your Performance</h1>
                <select onChange={(e) => setRange(e.target.value)} value={range} className="p-2 border-2 border-light rounded-lg font-semibold">
                    <option value="weekly">Last 7 Days</option>
                    <option value="monthly">This Month</option>
                </select>
            </div>
            <Card>
                {loading ? <Spinner /> : (
                    performance ? <PerformanceChart data={performance} /> : <p>No data available for this range.</p>
                )}
            </Card>
        </div>
    );
};

export default Performance;