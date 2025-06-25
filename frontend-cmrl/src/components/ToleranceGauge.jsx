import React from 'react';
import GaugeChart from 'react-gauge-chart';

const ToleranceGauge = ({ value, actual, label }) => {
  return (
    <div style={{ width: '280px', margin: '20px auto', textAlign: 'center' }}>
      <h4>{label}</h4>
      <GaugeChart
        id={`gauge-${label}`}
        nrOfLevels={20}
        percent={value / 100} // already percentage
        colors={["#5BE12C", "#F5CD19", "#EA4228"]}
        arcWidth={0.3}
        textColor="#000"
        needleColor="#444"
      />
      <div style={{ marginTop: '-20px', fontSize: '12px', color: '#555' }}>
        {actual} mm
      </div>
    </div>
  );
};


export default ToleranceGauge;
