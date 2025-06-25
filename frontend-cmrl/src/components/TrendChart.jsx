// src/components/TrendChart.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to show trends.</p>;

  const chartData = data.map((entry) => ({
    axle: entry.wheelId,
    diameterBeforeLH: entry.before?.LH?.diameter ?? null,
    diameterBeforeRH: entry.before?.RH?.diameter ?? null,
    diameterAfterLH: entry.after?.LH?.diameter ?? null,
    diameterAfterRH: entry.after?.RH?.diameter ?? null,
    qrBeforeLH: entry.before?.LH?.qr ?? null,
    qrBeforeRH: entry.before?.RH?.qr ?? null,
    qrAfterLH: entry.after?.LH?.qr ?? null,
    qrAfterRH: entry.after?.RH?.qr ?? null,
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
          <Line type="monotone" dataKey="diameterBeforeLH" stroke="#8884d8" name="Diameter Before LH" />
          <Line type="monotone" dataKey="diameterBeforeRH" stroke="#8884d8" strokeDasharray="5 5" name="Diameter Before RH" />
          <Line type="monotone" dataKey="diameterAfterLH" stroke="#82ca9d" name="Diameter After LH" />
          <Line type="monotone" dataKey="diameterAfterRH" stroke="#82ca9d" strokeDasharray="5 5" name="Diameter After RH" />
          <Line type="monotone" dataKey="qrBeforeLH" stroke="#ff7300" name="QR Before LH" />
          <Line type="monotone" dataKey="qrBeforeRH" stroke="#ff7300" strokeDasharray="5 5" name="QR Before RH" />
          <Line type="monotone" dataKey="qrAfterLH" stroke="#0088FE" name="QR After LH" />
          <Line type="monotone" dataKey="qrAfterRH" stroke="#0088FE" strokeDasharray="5 5" name="QR After RH" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
