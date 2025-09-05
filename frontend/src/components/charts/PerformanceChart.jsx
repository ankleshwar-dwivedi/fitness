import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PerformanceChart = ({ data }) => {
  const processedData = {};

  // Process calorie consumption
  data.calorieConsumption.forEach((item) => {
    processedData[item._id] = {
      ...processedData[item._id],
      date: item._id,
      consumed: item.totalCalories,
    };
  });

  // Process calorie burn
  data.calorieBurn.forEach((item) => {
    processedData[item._id] = {
      ...processedData[item._id],
      date: item._id,
      burned: item.totalCaloriesBurned,
    };
  });

  // NEW: Process weight history
  let lastWeight = null;
  data.weightHistory.forEach((item) => {
    processedData[item._id] = {
      ...processedData[item._id],
      date: item._id,
      weight: item.weight,
    };
    lastWeight = item.weight;
  });

  const chartData = Object.values(processedData).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // NEW: Forward-fill weight data to create a constant line
  let currentWeight = chartData.find((d) => d.weight)?.weight || null;
  chartData.forEach((d) => {
    if (d.weight) {
      currentWeight = d.weight;
    } else if (currentWeight) {
      d.weight = currentWeight;
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />

        {/* NEW: Define two separate Y-Axes */}
        <YAxis
          yAxisId="left"
          stroke="#8884d8"
          label={{
            value: "Calories (kcal)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#82ca9d"
          label={{ value: "Weight (kg)", angle: -90, position: "insideRight" }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        />
        <Legend />

        {/* Associate each line with a Y-Axis */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="consumed"
          name="Calories Consumed"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="burned"
          name="Calories Burned"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="weight"
          name="Weight (kg)"
          stroke="#ffc658"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
