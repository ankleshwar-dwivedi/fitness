import React from 'react';
import { motion } from 'framer-motion';

const GoalRingChart = ({ value, goal, label, color, unit = '' }) => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const offset = circumference - (percentage / 100) * circumference;

    const isOver = value > goal;
    const displayValue = value > 999 ? `${(value/1000).toFixed(1)}k` : Math.round(value);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="45" className="stroke-current text-light" strokeWidth="10" fill="transparent" />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        className={`stroke-current ${isOver ? 'text-danger' : color}`}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{displayValue}</span>
                    <span className="text-xs text-muted">/ {goal}{unit}</span>
                </div>
            </div>
            <p className="mt-2 font-semibold text-muted">{label}</p>
        </div>
    );
};

export default GoalRingChart;