import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWheelData } from '../services/api';

const Compartment2 = () => {
  const { state } = useLocation();
  const trainId = state?.trainId;

  const [wheelData, setWheelData] = useState([]);
  const [selectedWheel, setSelectedWheel] = useState(null);

  useEffect(() => {
    if (trainId) {
      console.log("🌐 Fetching data for:", trainId);
      getWheelData(trainId)
        .then(data => {
          console.log("✅ Wheel data fetched:", data);
          setWheelData(data);
        })
        .catch(err => console.error("❌ API error:", err));
    }
  }, [trainId]);

  // Axle identifiers for compartment 2
  const axleMapping = [
    "L9-R9", "L10-R10",
    "L11-R11", "L12-R12"
  ];

  const showInfo = (axleId) => {
    const left = wheelData.find(w => w.wheelId === `${axleId}-LH`);
    const right = wheelData.find(w => w.wheelId === `${axleId}-RH`);

    if (left?.before && right?.before && left?.after && right?.after) {
      setSelectedWheel({ wheelId: axleId, left, right });
    } else {
      alert(`⚠️ Missing BEFORE or AFTER data for ${axleId}`);
      setSelectedWheel(null);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* Left View */}
      <div style={{ width: '40%', padding: '40px', backgroundColor: '#eef2f7' }}>
        <h2>Compartment 2 - Train View</h2>
        <div style={{ position: 'relative', width: '300px', height: '500px', margin: 'auto' }}>
          <img src="/svg/body.svg" alt="body" style={{ position: 'absolute', width: '70%', top: '-30px' }} />
          <img src="/svg/bogie 1.svg" style={{ position: 'absolute', top: '40px', width: '70%' }} />
          <div style={{ top: '96px', left: '22%', position: 'absolute', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>BOGIE 1</div>
          <img src="/svg/bogie 2.svg" style={{ position: 'absolute', top: '350px', width: '70%' }} />
          <div style={{ top: '410px', left: '22%', position: 'absolute', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>BOGIE 2</div>

          {/* 8 wheels (4 axles: LH/RH pairs) */}
          {axleMapping.map((id, i) => (
            <div
              key={id}
              onClick={() => showInfo(id)}
              style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                background: 'black',
                borderRadius: '5px',
                cursor: 'pointer',
                top: `${i < 2 ? 100 : 420}px`,
                left: `${i % 2 === 0 ? 20 : 180}px`
              }}
              title={`View ${id}`}
            />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '60%', padding: '30px', background: '#fff', overflowY: 'auto' }}>
        <h2>Wheel Details</h2>
        {selectedWheel ? (
          <>
            <h3>{selectedWheel.wheelId}</h3>

            {/* BEFORE TABLE */}
            <h4>Before Reprofiling:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={cellHead}>Parameter</th>
                  <th style={cellHead}>LH</th>
                  <th style={cellHead}>RH</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={cellLabel}>Diameter</td><td>{selectedWheel.left.before.diameter}</td><td>{selectedWheel.right.before.diameter}</td></tr>
                <tr><td style={cellLabel}>Flange Height</td><td>{selectedWheel.left.before.flangeHeight}</td><td>{selectedWheel.right.before.flangeHeight}</td></tr>
                <tr><td style={cellLabel}>Flange Thickness</td><td>{selectedWheel.left.before.flangeThickness}</td><td>{selectedWheel.right.before.flangeThickness}</td></tr>
                <tr><td style={cellLabel}>QR Radius</td><td>{selectedWheel.left.before.qr}</td><td>{selectedWheel.right.before.qr}</td></tr>
              </tbody>
            </table>

            {/* AFTER TABLE */}
            <h4>After Reprofiling:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={cellHead}>Parameter</th>
                  <th style={cellHead}>LH</th>
                  <th style={cellHead}>RH</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={cellLabel}>Diameter</td><td>{selectedWheel.left.after.diameter}</td><td>{selectedWheel.right.after.diameter}</td></tr>
                <tr><td style={cellLabel}>Flange Height</td><td>{selectedWheel.left.after.flangeHeight}</td><td>{selectedWheel.right.after.flangeHeight}</td></tr>
                <tr><td style={cellLabel}>Flange Thickness</td><td>{selectedWheel.left.after.flangeThickness}</td><td>{selectedWheel.right.after.flangeThickness}</td></tr>
                <tr><td style={cellLabel}>QR Radius</td><td>{selectedWheel.left.after.qr}</td><td>{selectedWheel.right.after.qr}</td></tr>
              </tbody>
            </table>
          </>
        ) : (
          <p>Select a wheel axle to view detailed measurements.</p>
        )}
      </div>
    </div>
  );
};

const cellHead = {
  background: '#f0f0f0',
  fontWeight: 'bold',
  padding: '8px',
  border: '1px solid #ccc',
  textAlign: 'center'
};

const cellLabel = {
  background: '#fafafa',
  fontWeight: 'bold',
  padding: '8px',
  border: '1px solid #ccc'
};

export default Compartment2;
