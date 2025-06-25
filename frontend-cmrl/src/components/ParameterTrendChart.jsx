// src/components/ParameterTrendChart.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";

// Helper to average values across wheels per train
const calculateAverages = (data) => {
  const trainMap = {};

  data.forEach(entry => {
    const trainId = entry.trainId;
    const wheels = [
      ...(entry.before?.LH ? [entry.before.LH] : []),
      ...(entry.before?.RH ? [entry.before.RH] : []),
      ...(entry.after?.LH ? [entry.after.LH] : []),
      ...(entry.after?.RH ? [entry.after.RH] : [])
    ];

    if (!trainMap[trainId]) {
      trainMap[trainId] = {
        count: 0,
        diameter: 0,
        flangeHeight: 0,
        flangeThickness: 0,
        qr: 0
      };
    }

    wheels.forEach(wheel => {
      trainMap[trainId].diameter += wheel.diameter ?? 0;
      trainMap[trainId].flangeHeight += wheel.flangeHeight ?? 0;
      trainMap[trainId].flangeThickness += wheel.flangeThickness ?? 0;
      trainMap[trainId].qr += wheel.qr ?? 0;
      trainMap[trainId].count++;
    });
  });

  return Object.entries(trainMap).map(([trainId, vals]) => ({
    trainId,
    diameter: parseFloat((vals.diameter / vals.count).toFixed(2)),
    flangeHeight: parseFloat((vals.flangeHeight / vals.count).toFixed(2)),
    flangeThickness: parseFloat((vals.flangeThickness / vals.count).toFixed(2)),
    qr: parseFloat((vals.qr / vals.count).toFixed(2))
  }));
};

const ParameterTrendChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to show trends.</p>;

  const chartData = calculateAverages(data);

  return (
    <div className="w-full h-[400px] my-4">
      <h2 className="text-lg font-bold mb-2">Average Parameter Trend (Train-wise)</h2>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="trainId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="diameter" stroke="#8884d8" name="Diameter" />
          <Line type="monotone" dataKey="flangeHeight" stroke="#82ca9d" name="Flange Height" />
          <Line type="monotone" dataKey="flangeThickness" stroke="#ffc658" name="Flange Thickness" />
          <Line type="monotone" dataKey="qr" stroke="#ff4f4f" name="QR" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParameterTrendChart;
