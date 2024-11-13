import React from 'react';
import { motion } from 'framer-motion';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type DataPoint = {
    time: string;
    power: number;
};

type Props = {
    // chartData: DataPoint[];
    chartData: any[];
};

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any, label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-400 rounded-md p-2">
                time: {label}
                {payload.map((entry: any, idx: number) => {
                    return (
                        <div key={idx} className="group">
                            <span className="">{entry.dataKey}: </span>
                            <span className="">{entry.value}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
};

const EnergyConsumption = ({ chartData }: Props) => {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-extrabold mb-4 text-gray-100">Energy Consumption</h2>
            <div className="h-80">
                <ResponsiveContainer>
                    <ComposedChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis
                            dataKey="time"
                            stroke="#9CA3AF"
                            label={{
                                value: 'Time',
                                position: 'insideBottomRight',
                                offset: -5,
                                fill: '#E5E7EB',
                            }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            label={{
                                value: 'Power',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#E5E7EB',
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            // content={<CustomTooltip />}
                        />
                        <Legend />
                        {/* Bar chart */}
                        <Bar dataKey="power" barSize={20} fill="#8884d8">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                        <Area type="monotone" dataKey="power" fill="#d9d9d9d9" stroke="#d9d9d9d9" opacity={0.25} />            
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default EnergyConsumption;
