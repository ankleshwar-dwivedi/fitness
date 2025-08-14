import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#00b8ff', '#00c49f', '#ffbb28']; // Consumed, Burned, Left

const TodayChart = ({ data }) => {
  const chartData = [
    { name: 'Consumed', value: data.caloriesConsumed },
    { name: 'Burned', value: data.caloriesBurned },
    { name: 'Remaining Goal', value: Math.max(0, data.caloriesLeft) },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TodayChart;