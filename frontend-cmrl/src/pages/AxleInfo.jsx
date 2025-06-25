import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AxleChart from '../components/AxleChart';

const AxleInfo = () => {
  const [data, setData] = useState([]);
  const trainId = 'cmrltr1'; // You can later make it dynamic

  useEffect(() => {
    axios.get(`http://localhost:5000/api/wheels/${trainId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const formatChartData = (metric) => {
    const grouped = {};
    data.forEach((d) => {
      const axle = d.Axle;
      if (!grouped[axle]) grouped[axle] = { Axle: axle };
      grouped[axle][d.State.toLowerCase()] = d[metric];
    });
    return Object.values(grouped);
  };

  return (
    <div className="p-10 bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('/bg1.png')" }}>
      <h1 className="text-3xl font-bold text-center mb-10 text-white">Train: {trainId.toUpperCase()}</h1>
      <AxleChart data={formatChartData('diameter')} metric="diameter" />
      <AxleChart data={formatChartData('flangeHeight')} metric="flange height" />
      <AxleChart data={formatChartData('flangeThickness')} metric="flange thickness" />
      <AxleChart data={formatChartData('qr')} metric="QR radius" />
    </div>
  );
};

export default AxleInfo;
