import React from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, LabelList, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'

type DataPoint = {
    time: string;
    power: number;
};

type Props = {
    // chartData: DataPoint[];
    chartData: any[];
};
function PressureChart({ chartData }: Props) {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className="text-lg font-extrabold mb-4 text-gray-100">Pressure</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="time"
                        />
                        <YAxis
                            label={{
                                value: 'Pressure',
                                angle: -90,
                                fill: '#E5E7EB',
                            }}
                        />
                        <Tooltip />
                        <Area type="monotone" dataKey="pressure" stroke="#8884d8" fill="#8884d8"></Area>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default PressureChart