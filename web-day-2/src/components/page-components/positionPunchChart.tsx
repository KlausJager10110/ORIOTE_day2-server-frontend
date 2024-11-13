import React from 'react'
import { motion } from 'framer-motion'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
    // chartData: DataPoint[];
    chartData: any[];
};
function PositionPunchChart({ chartData }: Props) {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-extrabold mb-4 text-gray-100">Position of the punch</h2>
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
                        <XAxis
                            dataKey="time"
                        />
                        <YAxis
                            label={{
                                value: 'Position',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#E5E7EB',
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="position" stroke="#F59E0B" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default PositionPunchChart