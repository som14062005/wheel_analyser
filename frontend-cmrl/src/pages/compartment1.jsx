import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const Compartment1 = () => {
  const { state } = useLocation();
  const trainId = state?.trainId || 'Unknown';

  const [wheelData, setWheelData] = useState([]);
  const [selectedWheel, setSelectedWheel] = useState(null);

  useEffect(() => {
    // Fetch wheel data for this train
    axios.get(`http://localhost:5000/api/wheels/${trainId}`)
      .then(res => setWheelData(res.data))
      .catch(err => console.error(err));
  }, [trainId]);

  const showInfo = (wheelId) => {
    const wheel = wheelData.find(w => w.wheelId === wheelId);
    setSelectedWheel(wheel);
  };

  return (
    <div className="dashboard" style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Left Panel: Train SVG */}
      <div className="train-side" style={{ width: '40%', padding: '40px', backgroundColor: '#eef2f7' }}>
        <h2>Train Layout</h2>
        <div className="train-container" style={{ position: 'relative', width: '300px', height: '500px', margin: 'auto' }}>
          <img src="/svg/body.svg" className="train-body" style={{ position: 'absolute', width: '70%', top: '-30px' }} />
          <div className="body-label" style={{ top: '250px', left: '20%', position: 'absolute', zIndex: 10, fontWeight: 'bold' }}>TRAIN BOTTOM<br />VIEW</div>
          <img src="/svg/bogie 1.svg" className="bogie1" style={{ position: 'absolute', top: '40px', left: '0px', width: '70%' }} />
          <div className="bogie1-label" style={{ top: '96px', left: '22%', position: 'absolute', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>BOGIE 1</div>
          <img src="/svg/bogie 2.svg" className="bogie2" style={{ position: 'absolute', top: '350px', left: '0px', width: '70%' }} />
          <div className="bogie2-label" style={{ top: '410px', left: '22%', position: 'absolute', background: '#0008', color: 'white', padding: '4px 8px', borderRadius: '5px' }}>BOGIE 2</div>

          {[...Array(8)].map((_, i) => (
            <img
              key={i + 1}
              src={`/svg/wheel ${i + 1}.svg`}
              className={`wheel${i + 1}`}
              onClick={() => showInfo(i + 1)}
              style={{
                position: 'absolute',
                width: '30px',
                cursor: 'pointer',
                top: `${i < 2 ? 50 : i < 4 ? 140 : i < 6 ? 360 : 450}px`,
                left: `${i % 2 === 0 ? 10 : 170}px`,
                transition: 'transform 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Panel: Info */}
      <div className="info-side" style={{ width: '60%', padding: '30px', overflowY: 'auto', background: 'white' }}>
        <h2>Wheel Details</h2>
        <div className="scroll-box" style={{ background: 'white', padding: '20px', border: '1px solid #ccc', height: '90%', overflowY: 'auto' }}>
          {selectedWheel ? (
            <>
              <h3>Wheel {selectedWheel.wheelId} Selected</h3>
              <p><strong>Before Reprofiling:</strong><br />
                Diameter: {selectedWheel.before.diameter}mm<br />
                Flange Height: {selectedWheel.before.flangeHeight}mm<br />
                QR Radius: {selectedWheel.before.qrRadius}mm
              </p>
              <p><strong>After Reprofiling:</strong><br />
                Diameter: {selectedWheel.after.diameter}mm<br />
                Flange Height: {selectedWheel.after.flangeHeight}mm<br />
                QR Radius: {selectedWheel.after.qrRadius}mm
              </p>
            </>
          ) : (
            <p>Select a wheel to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compartment1;
