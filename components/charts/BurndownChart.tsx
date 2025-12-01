import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BurndownChartProps {
    data?: Array<{ day: string; ideal: number; actual: number }>;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({ data }) => {
    // Sample data if none provided
    const chartData = data || [
        { day: 'Day 1', ideal: 100, actual: 100 },
        { day: 'Day 2', ideal: 90, actual: 92 },
        { day: 'Day 3', ideal: 80, actual: 85 },
        { day: 'Day 4', ideal: 70, actual: 78 },
        { day: 'Day 5', ideal: 60, actual: 65 },
        { day: 'Day 6', ideal: 50, actual: 52 },
        { day: 'Day 7', ideal: 40, actual: 40 },
        { day: 'Day 8', ideal: 30, actual: 28 },
        { day: 'Day 9', ideal: 20, actual: 18 },
        { day: 'Day 10', ideal: 10, actual: 10 },
        { day: 'Day 11', ideal: 0, actual: 0 }
    ];

    return (
        <div className="w-full h-80 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Sprint Burndown</h3>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                        <span className="text-zinc-500">Ideal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-zinc-500">Actual</span>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                        dataKey="day"
                        stroke="#71717a"
                        style={{ fontSize: '11px' }}
                    />
                    <YAxis
                        stroke="#71717a"
                        style={{ fontSize: '11px' }}
                        label={{ value: 'Tasks Remaining', angle: -90, position: 'insideLeft', style: { fill: '#71717a', fontSize: '11px' } }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <ReferenceLine y={0} stroke="#3f3f46" />
                    <Area
                        type="monotone"
                        dataKey="ideal"
                        stroke="#71717a"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                    />
                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#actualGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
