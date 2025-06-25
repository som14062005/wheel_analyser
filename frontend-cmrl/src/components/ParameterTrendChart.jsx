import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const ParameterTrendChart = ({ data }) => {
  return (
    <div className="w-full h-[400px] my-4">
      <h2 className="text-lg font-bold mb-2">Average Parameter Trend (Train-wise)</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="trainId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="diameter" stroke="#8884d8" />
          <Line type="monotone" dataKey="flangeHeight" stroke="#82ca9d" />
          <Line type="monotone" dataKey="flangeThickness" stroke="#ffc658" />
          <Line type="monotone" dataKey="qr" stroke="#ff4f4f" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParameterTrendChart;
