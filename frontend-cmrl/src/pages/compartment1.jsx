import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWheelData } from '../services/api';
import WheelChart from '../components/WheelChart'; // ✅ Capital 'C'
import ToleranceGauge from '../components/ToleranceGauge';


const normalize = (value, max) => (value / max) * 100;

const Compartment1 = () => {
  const { state } = useLocation();
  const trainId = state?.trainId;

  const [wheelData, setWheelData] = useState([]);
  const [selectedWheel, setSelectedWheel] = useState(null);

  useEffect(() => {
    console.log("✅ Received Train ID:", trainId);
  }, [trainId]);

  useEffect(() => {
    if (trainId) {
      console.log("🌐 Sending API call to:", `${import.meta.env.VITE_API_URL}/api/wheels/${trainId}`);
      getWheelData(trainId)
        .then(data => {
          console.log("✅ Fetched wheelData:", data);
          setWheelData(data);
        })
        .catch(err => console.error("❌ API Fetch Error:", err));
    }
  }, [trainId]);

  const axles = [
    { id: 'R1-L1', label: 'Axle 1', img: '/svg/axle1.svg', top: 50 },
    { id: 'R2-L2', label: 'Axle 2', img: '/svg/axle2.svg', top: 140 },
    { id: 'R3-L3', label: 'Axle 3', img: '/svg/axle3.svg', top: 360 },
    { id: 'R4-L4', label: 'Axle 4', img: '/svg/axle4.svg', top: 450 },
  ];

  const showInfo = (axleId) => {
    const lhId = `${axleId}-LH`;
    const rhId = `${axleId}-RH`;

    const left = wheelData.find(w => w.wheelId === lhId);
    const right = wheelData.find(w => w.wheelId === rhId);

    if (left?.before && left?.after && right?.before && right?.after) {
      setSelectedWheel({
        wheelId: axleId,
        left,
        right
      });
    } else {
      alert(`⚠️ Missing BEFORE or AFTER data for ${axleId}.`);
      setSelectedWheel(null);
    }
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    background: 'white',
    marginBottom: '20px'
  };

  const paramStyle = {
    textAlign: 'left',
    fontWeight: 'bold',
    background: '#f8f8f8'
  };

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '40%', padding: '40px', backgroundColor: '#eef2f7' }}>
        <h2>Train Layout</h2>
        <div style={{ position: 'relative', width: '300px', height: '500px', margin: 'auto' }}>
          <img src="/svg/body.svg" alt="Train Body" style={{ position: 'absolute', width: '70%', top: '-30px' }} />
          <div style={{ position: 'absolute', top: '270px', left: '8%', zIndex: 10, fontWeight: 'bold' }}>
            TRAIN BOTTOM VIEW
          </div>
          <img src="/svg/bogie 1.svg" style={{ position: 'absolute', top: '60px', left: '0px', width: '70%' }} />
          <div style={{ position: 'absolute', top: '120px', left: '22%', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>
            BOGIE 1
          </div>
          <img src="/svg/bogie 2.svg" style={{ position: 'absolute', top: '370px', left: '0px', width: '70%' }} />
          <div style={{ position: 'absolute', top: '430px', left: '22%', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>
            BOGIE 2
          </div>
          {axles.map((axle) => (
            <img
              key={axle.id}
              src={axle.img}
              alt={axle.label}
              onClick={() => showInfo(axle.id)}
              title={axle.label}
              style={{
                position: 'absolute',
                top: `${axle.top}px`,
                left: '-43px',
                width: '1000px',
                height: '85px',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ width: '60%', padding: '30px', overflowY: 'auto', background: 'white' }}>
        <h2>Wheel Details</h2>
        <div style={{ background: 'white', padding: '20px', border: '1px solid #ccc', height: '90%', overflowY: 'auto' }}>
          {selectedWheel ? (
            <>
              <h3>Wheel Axle: {selectedWheel.wheelId}</h3>

              <div style={{ fontWeight: 'bold', fontSize: '14px', margin: '20px 0 10px' }}>Before:</div>
              <table style={tableStyle}>
                <thead>
                  <tr><th></th><th>LH</th><th>RH</th></tr>
                </thead>
                <tbody>
                  <tr><td style={paramStyle}>WHEEL DIAMETER</td><td>{selectedWheel.left.before.diameter}</td><td>{selectedWheel.right.before.diameter}</td></tr>
                  <tr><td style={paramStyle}>FLANGE HEIGHT</td><td>{selectedWheel.left.before.flangeHeight}</td><td>{selectedWheel.right.before.flangeHeight}</td></tr>
                  <tr><td style={paramStyle}>FLANGE THICKNESS</td><td>{selectedWheel.left.before.flangeThickness}</td><td>{selectedWheel.right.before.flangeThickness}</td></tr>
                  <tr><td style={paramStyle}>QR</td><td>{selectedWheel.left.before.qr}</td><td>{selectedWheel.right.before.qr}</td></tr>
                </tbody>
              </table>

              <div style={{ fontWeight: 'bold', fontSize: '14px', margin: '20px 0 10px' }}>After:</div>
              <table style={tableStyle}>
                <thead>
                  <tr><th></th><th>LH</th><th>RH</th></tr>
                </thead>
                <tbody>
                  <tr><td style={paramStyle}>WHEEL DIAMETER</td><td>{selectedWheel.left.after.diameter}</td><td>{selectedWheel.right.after.diameter}</td></tr>
                  <tr><td style={paramStyle}>FLANGE HEIGHT</td><td>{selectedWheel.left.after.flangeHeight}</td><td>{selectedWheel.right.after.flangeHeight}</td></tr>
                  <tr><td style={paramStyle}>FLANGE THICKNESS</td><td>{selectedWheel.left.after.flangeThickness}</td><td>{selectedWheel.right.after.flangeThickness}</td></tr>
                  <tr><td style={paramStyle}>QR</td><td>{selectedWheel.left.after.qr}</td><td>{selectedWheel.right.after.qr}</td></tr>
                </tbody>
              </table>

              <div style={{ marginTop: '30px' }}>
  <h3>📊 Visualization: LH vs RH Comparison</h3>
  <WheelChart left={selectedWheel.left} right={selectedWheel.right} />
</div>

<div style={{ marginTop: '40px' }}>
  <h3>🎯 Live Gauge View</h3>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
    <ToleranceGauge
      value={normalize(parseFloat(selectedWheel.left.after.diameter), 900)}
      actual={parseFloat(selectedWheel.left.after.diameter)}
      label="LH Diameter"
    />
    <ToleranceGauge
      value={normalize(parseFloat(selectedWheel.right.after.diameter), 900)}
      actual={parseFloat(selectedWheel.right.after.diameter)}
      label="RH Diameter"
    />
    <ToleranceGauge
      value={normalize(parseFloat(selectedWheel.left.after.qr), 14)}
      actual={parseFloat(selectedWheel.left.after.qr)}
      label="LH QR"
    />
    <ToleranceGauge
      value={normalize(parseFloat(selectedWheel.right.after.qr), 14)}
      actual={parseFloat(selectedWheel.right.after.qr)}
      label="RH QR"
    />
  </div>
</div>


            </>
          ) : (
            <p>Select an axle to view its wheel details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compartment1;
