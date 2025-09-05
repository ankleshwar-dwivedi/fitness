// /frontend/src/components/charts/TodayMetrics.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
    MEAL: ['#ef4444', '#f87171'],
    WORKOUT: ['#10b981', '#34d399'],
    BALANCE: ['#00b8ff', '#38bdf8']
};

const MetricRingChart = ({ data, colors, title, unit }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    return (
        <div className="flex flex-col items-center">
            <div style={{ width: '100%', height: 150 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                         <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-primary">
                            {`${Math.round(data[0].value)}`}
                        </text>
                         <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted">
                            {unit}
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="font-bold text-center mt-2">{title}</p>
            <Legend
                payload={data.map((entry, index) => ({
                    value: entry.name,
                    type: 'square',
                    color: colors[index % colors.length]
                }))}
            />
        </div>
    );
};


const TodayMetrics = ({ summary }) => {
    const { calorieGoal, caloriesConsumed, caloriesBurned, caloriesLeft } = summary;

    const mealData = [
        { name: 'Consumed', value: caloriesConsumed },
        { name: 'Remaining', value: Math.max(0, calorieGoal - caloriesConsumed) }
    ];

    const workoutData = [
        { name: 'Burned', value: caloriesBurned },
        { name: 'From Goal', value: Math.max(0, calorieGoal - caloriesBurned) }
    ];
    
    const balanceData = caloriesLeft >= 0 
        ? [ { name: 'Net Burned/Unused', value: calorieGoal - caloriesLeft }, { name: 'Left', value: caloriesLeft }]
        : [ { name: 'Goal', value: calorieGoal + caloriesBurned }, { name: 'Surplus', value: Math.abs(caloriesLeft) } ];


    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricRingChart data={mealData} colors={COLORS.MEAL} title="Meal Calories" unit="kcal" />
            <MetricRingChart data={workoutData} colors={COLORS.WORKOUT} title="Workout Calories" unit="kcal" />
            <MetricRingChart data={balanceData} colors={COLORS.BALANCE} title="Net Balance" unit="kcal" />
        </div>
    );
};

export default TodayMetrics;