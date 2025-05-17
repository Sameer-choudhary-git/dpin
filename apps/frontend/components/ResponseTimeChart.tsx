
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResponseTimeChartProps {
  data: { time: string; value: number }[];
}

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <XAxis 
          dataKey="time"
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}ms`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(210 29% 13%)',
            borderColor: 'hsl(210 15% 18%)',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '4px',
          }}
          labelStyle={{ color: '#cbd5e1' }}
        />
        <Line 
          type="monotone"
          dataKey="value" 
          stroke="hsl(210 100% 52%)" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="Response Time"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ResponseTimeChart;
