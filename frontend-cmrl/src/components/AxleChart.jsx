import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const AxleChart = ({ data, metric }) => {
  return (
    <div className="w-full h-[400px] mb-10">
      <h2 className="text-xl font-bold mb-4 capitalize">{metric} Comparison</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="Axle" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="before" fill="#8884d8" />
          <Bar dataKey="after" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AxleChart;
