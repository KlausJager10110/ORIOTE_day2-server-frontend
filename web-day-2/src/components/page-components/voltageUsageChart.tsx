import React from 'react'
import { motion } from 'framer-motion'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'

type DataPoint = {
  time: string;
  power: number;
};

type Props = {
  chartData: any[];
};

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

function VoltageUsageChart({ chartData }: Props) {
  return (
    <div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ delay: 0.2 }}
    >
      <h2 className='text-lg font-extrabold mb-4 text-gray-100'>Voltage Usage</h2>

      <div className='h-80 m-2'>
        <ResponsiveContainer width={"100%"} height={"100%"} >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis
              dataKey="time"
              stroke='#9ca3af'
              label={{
                value: 'Time',
                position: 'insideBottomRight',
                offset: -5,
                fill: '#E5E7EB',
              }}
            />
            <YAxis
              stroke='#9ca3af'
              domain={['auto', 'auto']}
              label={{
                value: 'Voltage', 
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
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              verticalAlign="top"
              align="center"
              iconType="circle"
              iconSize={10}
              payload={[
                { value: 'L1_GND', type: 'line', color: COLORS[1] },
                { value: 'L2_GND', type: 'line', color: COLORS[2] },
                { value: 'L3_GND', type: 'line', color: COLORS[3] },
              ]}
            />
            <Line
              type='monotone'
              dataKey='L1_GND'
              name="L1 Ground"
              stroke={COLORS[1]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type='monotone'
              dataKey='L2_GND'
              name="L2 Ground"
              stroke={COLORS[2]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type='monotone'
              dataKey='L3_GND'
              name="L3 Ground"
              stroke={COLORS[3]}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VoltageUsageChart
