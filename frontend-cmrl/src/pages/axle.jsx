import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import trainImg from '../assets/WHT.png';
import compartment1 from '../assets/compartment1.png';
import compartment2 from '../assets/compartment2.png';
import compartment3 from '../assets/compartment3.png';
import compartment4 from '../assets/compartment4.png';

import WheelVisualization from '../components/WheelVisualization';
import TrainAxleMap from '../components/TrainAxleMap'; // Import the new component

const AxleInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trainId = location.state?.trainId || 'Unknown';

  const [wheelData, setWheelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trainId === 'Unknown') {
      setLoading(false);
      setError('Train ID unknown');
      return;
    }

    const API_URL = `http://localhost:5000/api/wheels/${trainId}`;

    const fetchWheelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setWheelData(data[0]);  // Take first wheel data object
        } else {
          setError('No wheel data found');
        }
      } catch (err) {
        setError('Failed to fetch wheel data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWheelData();
  }, [trainId]);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="flex items-center bg-[#b2dfdb] px-6 py-4 border-b-2 border-gray-400 rounded-b-xl">
        <img
          src={trainImg}
          alt="Train"
          className="w-[90px] h-[90px] object-cover rounded-full border-2 border-gray-800 mr-6"
        />
        <div className="flex-1 text-xl font-bold">
          Train ID: <span className="text-black">{trainId}</span>
        </div>
        <div className="text-lg font-bold text-gray-800">HEALTH SCORE : 88/100</div>
      </div>

      {/* Axle Comparison */}
      <div className="p-6">
        <h3 className="text-2xl font-semibold">Axle-wise Comparison:</h3>
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          <img
            src={compartment1}
            alt="Compartment 1"
            onClick={() => navigate('/comp1', { state: { trainId } })}
            className="w-[300px] cursor-pointer hover:scale-105 transition-transform"
          />
          <img
            src={compartment2}
            alt="Compartment 2"
            onClick={() => navigate('/comp2', { state: { trainId } })}
            className="w-[300px] cursor-pointer hover:scale-105 transition-transform"
          />
          <img
            src={compartment3}
            alt="Compartment 3"
            onClick={() => navigate('/comp3', { state: { trainId } })}
            className="w-[300px] cursor-pointer hover:scale-105 transition-transform"
          />
          <img
            src={compartment4}
            alt="Compartment 4"
            onClick={() => navigate('/comp4', { state: { trainId } })}
            className="w-[300px] cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Train Axle Map - Add this new section */}
      <TrainAxleMap trainId={trainId} />

      {/* Show loading/error or wheel visualization */}
      <div className="p-6">
        {loading && <div className="text-center">Loading wheel data...</div>}
        {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
        {wheelData && <WheelVisualization wheelData={wheelData} />}
      </div>
    </div>
  );
};

export default AxleInfo;