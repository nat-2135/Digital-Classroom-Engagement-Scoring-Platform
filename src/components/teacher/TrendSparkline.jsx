import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TrendSparkline = ({ data = [] }) => {
    if (!data || data.length < 2) return <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Insufficient data</div>;

    const chartData = data.map((score, i) => ({ val: score, i }));
    const trend = data[data.length - 1] >= data[data.length - 2] ? '#10b981' : '#ef4444';

    return (
        <div style={{ height: '30px', width: '80px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={trend}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={600}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendSparkline;
