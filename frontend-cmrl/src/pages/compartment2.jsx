// src/pages/Compartment2.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWheelData } from '../services/api';
import WheelChart from '../components/WheelChart';
import ToleranceGauge from '../components/ToleranceGauge';
import HeatmapChart from '../components/HeatmapChart';
import WheelRadarChart from '../components/WheelRadarChart';
import TrendChart from '../components/TrendChart';

const normalize = (value, max) => (value / max) * 100;

const Compartment2 = () => {
  const { state } = useLocation();
  const trainId = state?.trainId;

  const [wheelData, setWheelData] = useState([]);
  const [selectedWheel, setSelectedWheel] = useState(null);

  useEffect(() => {
    if (trainId) {
      getWheelData(trainId)
        .then(data => setWheelData(data))
        .catch(err => console.error("API Error:", err));
    }
  }, [trainId]);

  const axles = [
    { id: 'R5-L5', label: 'Axle 5', img: '/svg/axle1.svg', top: 50 },
    { id: 'R6-L6', label: 'Axle 6', img: '/svg/axle2.svg', top: 140 },
    { id: 'R7-L7', label: 'Axle 7', img: '/svg/axle3.svg', top: 360 },
    { id: 'R8-L8', label: 'Axle 8', img: '/svg/axle4.svg', top: 450 },
  ];

  const showInfo = (axleId) => {
    const lhId = `${axleId}-LH`;
    const rhId = `${axleId}-RH`;
    const left = wheelData.find(w => w.wheelId === lhId);
    const right = wheelData.find(w => w.wheelId === rhId);

    if (left?.before && left?.after && right?.before && right?.after) {
      setSelectedWheel({ wheelId: axleId, left, right });
    } else {
      alert(`⚠️ Missing data for ${axleId}.`);
      setSelectedWheel(null);
    }
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden">

      {/* LEFT: Static Layout */}
      <div className="w-[40%] p-6 bg-slate-200 overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Train Layout </h2>
        <div className="relative w-[300px] h-[500px] mx-auto">
          <img src="/svg/body.svg" alt="Train Body" className="absolute w-[70%] top-[-30px]" />
          <div className="absolute top-[270px] left-[8%] z-10 font-bold">TRAIN BOTTOM VIEW</div>

          <img src="/svg/bogie 1.svg" className="absolute top-[60px] left-0 w-[70%]" />
          <div className="absolute top-[120px] left-[22%] bg-black bg-opacity-50 text-white px-2 py-1 rounded">BOGIE 3</div>

          <img src="/svg/bogie 2.svg" className="absolute top-[370px] left-0 w-[70%]" />
          <div className="absolute top-[430px] left-[22%] bg-black bg-opacity-50 text-white px-2 py-1 rounded">BOGIE 4</div>

          {axles.map(axle => (
            <img
              key={axle.id}
              src={axle.img}
              alt={axle.label}
              onClick={() => showInfo(axle.id)}
              title={axle.label}
              className="absolute left-[-43px] w-[1000px] h-[85px] cursor-pointer"
              style={{ top: `${axle.top}px` }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Scrollable Visualizations */}
      <div className="w-[60%] h-full overflow-y-auto p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Wheel Details</h2>

        {selectedWheel ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Axle ID: {selectedWheel.wheelId}</h3>

            <div>
              <h4 className="font-semibold mb-2">Before</h4>
              <table className="w-full text-sm border mb-4">
                <thead className="bg-gray-200">
                  <tr><th></th><th>LH</th><th>RH</th></tr>
                </thead>
                <tbody>
                  <tr><td>Diameter</td><td>{selectedWheel.left.before.diameter}</td><td>{selectedWheel.right.before.diameter}</td></tr>
                  <tr><td>Flange Height</td><td>{selectedWheel.left.before.flangeHeight}</td><td>{selectedWheel.right.before.flangeHeight}</td></tr>
                  <tr><td>Flange Thickness</td><td>{selectedWheel.left.before.flangeThickness}</td><td>{selectedWheel.right.before.flangeThickness}</td></tr>
                  <tr><td>QR</td><td>{selectedWheel.left.before.qr}</td><td>{selectedWheel.right.before.qr}</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-semibold mb-2">After</h4>
              <table className="w-full text-sm border">
                <thead className="bg-gray-200">
                  <tr><th></th><th>LH</th><th>RH</th></tr>
                </thead>
                <tbody>
                  <tr><td>Diameter</td><td>{selectedWheel.left.after.diameter}</td><td>{selectedWheel.right.after.diameter}</td></tr>
                  <tr><td>Flange Height</td><td>{selectedWheel.left.after.flangeHeight}</td><td>{selectedWheel.right.after.flangeHeight}</td></tr>
                  <tr><td>Flange Thickness</td><td>{selectedWheel.left.after.flangeThickness}</td><td>{selectedWheel.right.after.flangeThickness}</td></tr>
                  <tr><td>QR</td><td>{selectedWheel.left.after.qr}</td><td>{selectedWheel.right.after.qr}</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-semibold">📊 LH vs RH Comparison</h4>
              <WheelChart left={selectedWheel.left} right={selectedWheel.right} />
            </div>

            <div>
              <h4 className="font-semibold">🎯 Tolerance Gauges</h4>
              <div className="flex flex-wrap justify-center gap-4">
                <ToleranceGauge value={normalize(selectedWheel.left.after.diameter, 900)} actual={selectedWheel.left.after.diameter} label="LH Diameter" />
                <ToleranceGauge value={normalize(selectedWheel.right.after.diameter, 900)} actual={selectedWheel.right.after.diameter} label="RH Diameter" />
                <ToleranceGauge value={normalize(selectedWheel.left.after.qr, 14)} actual={selectedWheel.left.after.qr} label="LH QR" />
                <ToleranceGauge value={normalize(selectedWheel.right.after.qr, 14)} actual={selectedWheel.right.after.qr} label="RH QR" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">👆 Click an axle to load data visualization.</p>
        )}

        {/* 🔍 Additional Charts */}
        <div className="pt-8 border-t border-gray-300 mt-8">
          <h4 className="text-lg font-semibold mb-4">🔍 Additional Insights</h4>
          <div className="grid gap-6">
            <div>
              <h5 className="font-semibold mb-2">🔥 Heatmap Overview</h5>
              <HeatmapChart data={wheelData} />
            </div>
            <div>
              <h5 className="font-semibold mb-2">🌀 Radar Comparison</h5>
              <WheelRadarChart data={wheelData} />
            </div>
            <div>
              <h5 className="font-semibold mb-2">📈 Parameter Trends</h5>
              <TrendChart data={wheelData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compartment2;
