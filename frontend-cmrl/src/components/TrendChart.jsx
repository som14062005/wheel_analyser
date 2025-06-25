// src/components/TrendChart.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to show trends.</p>;

  // Group and transform data by axle for each parameter
  const chartData = data.map((entry) => ({
    axle: entry.wheelId,
    diameterBefore: entry.before?.diameter ?? null,
    diameterAfter: entry.after?.diameter ?? null,
    qrBefore: entry.before?.qr ?? null,
    qrAfter: entry.after?.qr ?? null,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="axle" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="diameterBefore"
            stroke="#8884d8"
            name="Diameter Before"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="diameterAfter"
            stroke="#82ca9d"
            name="Diameter After"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="qrBefore"
            stroke="#ff7300"
            name="QR Before"
            strokeDasharray="5 5"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="qrAfter"
            stroke="#0088FE"
            name="QR After"
            strokeDasharray="5 5"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
