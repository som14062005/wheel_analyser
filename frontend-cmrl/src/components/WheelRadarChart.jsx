import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const WheelRadarChart = ({ wheel }) => {
  if (!wheel) return <p>No wheel selected</p>;

  const data = ["diameter", "flangeHeight", "flangeThickness", "qr"].map((key) => ({
    parameter: key,
    Before: wheel.before[key],
    After: wheel.after[key]
  }));

  return (
    <div className="w-full h-[400px] my-4">
      <h2 className="text-lg font-bold mb-2">Radar Chart - {wheel.wheelId}</h2>
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="parameter" />
          <PolarRadiusAxis />
          <Radar name="Before" dataKey="Before" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="After" dataKey="After" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WheelRadarChart;
