import React from 'react';
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

// Normalize to percentage
const normalize = (value, max) => (value / max) * 100;

const WheelChart = ({ left, right }) => {
  const labels = ['Diameter', 'Flange Height', 'Flange Thickness', 'QR'];

  // Normalize all values based on max tolerances
  const beforeLH = [
    normalize(left.before.diameter, 900),
    normalize(left.before.flangeHeight, 35),
    normalize(left.before.flangeThickness, 35),
    normalize(left.before.qr, 14)
  ];

  const beforeRH = [
    normalize(right.before.diameter, 900),
    normalize(right.before.flangeHeight, 35),
    normalize(right.before.flangeThickness, 35),
    normalize(right.before.qr, 14)
  ];

  const afterLH = [
    normalize(left.after.diameter, 900),
    normalize(left.after.flangeHeight, 35),
    normalize(left.after.flangeThickness, 35),
    normalize(left.after.qr, 14)
  ];

  const afterRH = [
    normalize(right.after.diameter, 900),
    normalize(right.after.flangeHeight, 35),
    normalize(right.after.flangeThickness, 35),
    normalize(right.after.qr, 14)
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'LH - Before',
        data: beforeLH,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        fill: true,
      },
      {
        label: 'RH - Before',
        data: beforeRH,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        fill: true,
      },
      {
        label: 'LH - After',
        data: afterLH,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'RH - After',
        data: afterRH,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderDash: [5, 5],
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Wheel Profile Comparison (in %)',
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.formattedValue}%`;
          }
        }
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          callback: (val) => `${val}%`
        },
        angleLines: { display: true }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default WheelChart;
