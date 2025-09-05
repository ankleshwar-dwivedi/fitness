// /frontend/src/components/charts/DailyProgressRings.jsx
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const RingChart = ({ value, total, title, color, unit }) => {
  const percentage = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const data = [{ name: title, value: percentage }];

  return (
    <div className="flex flex-col items-center">
        <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="85%"
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                    barSize={10}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={5}
                        fill={color}
                        angleAxisId={0}
                    />
                     <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-primary">
                        {Math.round(value)}
                    </text>
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted">
                        / {total} {unit}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
      <p className="font-bold text-center -mt-4">{title}</p>
    </div>
  );
};


const DailyProgressRings = ({ summary }) => {
    const { calorieGoal, caloriesConsumed, caloriesBurned } = summary;
    const caloriesLeft = calorieGoal - caloriesConsumed + caloriesBurned;
    
    // Logic for the surplus/balance chart
    const balanceTitle = caloriesLeft >= 0 ? 'Calories Remaining' : 'Calorie Surplus';
    const balanceValue = Math.abs(caloriesLeft);
    const balanceTotal = calorieGoal;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <RingChart 
                value={caloriesConsumed} 
                total={calorieGoal} 
                title="Meals" 
                color="#ef4444" 
                unit="kcal"
            />
            <RingChart 
                value={caloriesBurned} 
                total={500} // Example burn goal, can be made dynamic later
                title="Workout" 
                color="#10b981"
                unit="kcal"
            />
            <RingChart 
                value={balanceValue} 
                total={balanceTotal} 
                title={balanceTitle} 
                color="#00b8ff"
                unit="kcal"
            />
        </div>
    );
};

export default DailyProgressRings;