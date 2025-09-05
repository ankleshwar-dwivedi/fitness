// /frontend/src/components/charts/WeightChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeightChart = ({ data }) => {
  // Ensure data is sorted by date for a correct line graph
  const chartData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #00c49f',
            borderRadius: '10px'
          }}
          formatter={(value) => `${value} kg`}
        />
        <Legend />
        <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#00c49f" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;