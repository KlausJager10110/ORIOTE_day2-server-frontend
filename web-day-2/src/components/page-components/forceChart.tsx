import React from 'react'
import { motion } from 'framer-motion'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
    // chartData: DataPoint[];
    chartData: any[];
};
function ForceChart({ chartData }: Props) {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-extrabold mb-4 text-gray-100">Force</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF"
                            label={{
                                value: 'Force',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#E5E7EB',
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="force" stroke="#82ca9d" strokeDasharray="3 4 5 2" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default ForceChart