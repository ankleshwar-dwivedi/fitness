import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data }) => {
  // Process the raw data from the backend to be chart-ready
  const processedData = {};
  data.calorieConsumption.forEach(item => {
    processedData[item._id] = { ...processedData[item._id], date: item._id, consumed: item.totalCalories };
  });
  data.calorieBurn.forEach(item => {
    processedData[item._id] = { ...processedData[item._id], date: item._id, burned: item.totalCaloriesBurned };
  });

  const chartData = Object.values(processedData).sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            border: '1px solid #00b8ff',
            borderRadius: '10px'
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="consumed" name="Calories Consumed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="burned" name="Calories Burned" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;