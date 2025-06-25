// src/pages/AxleDataVisualizer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AxleChart from "../components/AxleChart";
import Heatmap from "../components/HeatmapChart";
import WheelRadarChart from "../components/WheelRadarChart";
import ParameterTrendChart from "../components/ParameterTrendChart";

const AxleDataVisualizer = ({ trainId, axle }) => {
  const [wheelData, setWheelData] = useState([]);
  const [selectedWheel, setSelectedWheel] = useState(null);
  const [trendData, setTrendData] = useState([]);

  // Load data from backend
  useEffect(() => {
    axios.get(`http://localhost:5000/api/wheels/${trainId}`)
      .then((res) => {
        setWheelData(res.data);
        setTrendData(generateTrendData(res.data));
        if (res.data.length > 0) setSelectedWheel(res.data[0]); // default selection
      })
      .catch((err) => console.error("Error fetching wheel data:", err));
  }, [trainId]);

  // Format axle data for the existing 4 charts
  const formatChartData = (metric) => {
    const filtered = wheelData.filter((d) => d.Axle === axle);
    if (filtered.length === 0) return [];
    const result = { Axle: axle };
    filtered.forEach((item) => {
      result[item.State.toLowerCase()] = item[metric];
    });
    return [result];
  };

  // Generate train-level average parameter trend data
  const generateTrendData = (allWheels) => {
    const trainMap = {};

    allWheels.forEach((wheel) => {
      const [trainIdPart] = wheel.wheelId ? wheel.wheelId.split("-") : [`Train-${trainId}`]; // fallback
      if (!trainMap[trainIdPart]) {
        trainMap[trainIdPart] = {
          count: 0,
          diameter: 0,
          flangeHeight: 0,
          flangeThickness: 0,
          qr: 0,
        };
      }

      const avg = (a, b) => (a + b) / 2;
      trainMap[trainIdPart].count += 1;
      trainMap[trainIdPart].diameter += avg(wheel.before?.diameter ?? 0, wheel.after?.diameter ?? 0);
      trainMap[trainIdPart].flangeHeight += avg(wheel.before?.flangeHeight ?? 0, wheel.after?.flangeHeight ?? 0);
      trainMap[trainIdPart].flangeThickness += avg(wheel.before?.flangeThickness ?? 0, wheel.after?.flangeThickness ?? 0);
      trainMap[trainIdPart].qr += avg(wheel.before?.qr ?? 0, wheel.after?.qr ?? 0);
    });

    return Object.entries(trainMap).map(([tid, data]) => ({
      trainId: tid,
      diameter: data.diameter / data.count,
      flangeHeight: data.flangeHeight / data.count,
      flangeThickness: data.flangeThickness / data.count,
      qr: data.qr / data.count,
    }));
  };

  return (
    <div className="p-4 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Axle Data Visualizer</h1>

      {/* ✅ Existing axle-wise charts */}
      <div className="space-y-8">
        <AxleChart data={formatChartData("diameter")} metric="Diameter" />
        <AxleChart data={formatChartData("flangeHeight")} metric="Flange Height" />
        <AxleChart data={formatChartData("flangeThickness")} metric="Flange Thickness" />
        <AxleChart data={formatChartData("qr")} metric="QR Radius" />
      </div>

      {/* ✅ Heatmap (wheel-by-wheel parameter change) */}
      {wheelData.length > 0 && (
        <Heatmap data={wheelData} onSelect={(wheel) => setSelectedWheel(wheel)} />
      )}

      {/* ✅ Train-wise parameter trend over time */}
      {trendData.length > 0 && <ParameterTrendChart data={trendData} />}

      {/* ✅ Radar chart showing before vs after for a wheel */}
      {selectedWheel && <WheelRadarChart wheel={selectedWheel} />}
    </div>
  );
};

export default AxleDataVisualizer;
