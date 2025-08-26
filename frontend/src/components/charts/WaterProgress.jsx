import { Droplets } from 'lucide-react';

const WaterProgress = ({ consumed, goal }) => {
    const percentage = Math.min(100, (consumed / goal) * 100);

    return (
        <div>
            <div className="flex justify-between items-end mb-1">
                <h3 className="font-bold text-primary flex items-center gap-2">
                    <Droplets className="text-cyan-500" />
                    Water Intake
                </h3>
                <p className="font-bold text-primary">
                    <span className="text-cyan-500">{consumed}</span> / {goal} ml
                </p>
            </div>
            <div className="w-full bg-light rounded-full h-4">
                <div
                    className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default WaterProgress;