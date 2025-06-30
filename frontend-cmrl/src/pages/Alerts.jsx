import React, { useEffect, useState } from "react";
import axios from "axios";

const Alerts = () => {
  const [alertData, setAlertData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPredictions = async () => {
      const today = new Date();
      const trainIds = Array.from({ length: 52 }, (_, i) => `cmrltr${i + 1}`);

      const promises = trainIds.map(async (trainId) => {
  try {
    const res = await axios.get(`http://localhost:5001/predict/${trainId}`);
    const wheels = res.data;

    // ✅ Loop through each wheelId object
    return wheels.flatMap((wheel) => {
      return ["LH", "RH"].map((side) => {
        const sideData = wheel.after[side];
        return {
          trainId: wheel.TrainID,
          wheelId: wheel.wheelId,
          side,
          expectedDate: new Date(sideData.expected_replacement_date),
          rul: sideData.rul_days,
          installDate: sideData.install_date,
        };
      });
    });
  } catch (err) {
    return []; // skip this train if 404 or error
  }
});


      const allWheelsNested = await Promise.all(promises);
      const allWheels = allWheelsNested.flat();

      const upcomingSorted = allWheels
        .filter((w) => w.expectedDate >= today)
        .sort((a, b) => a.expectedDate - b.expectedDate);

      setAlertData(upcomingSorted);
      setLoading(false);
    };

    fetchAllPredictions();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">🚨 Upcoming Wheel Replacements</h1>

      {loading ? (
        <p className="text-center text-gray-500">Fetching prediction data...</p>
      ) : alertData.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming replacements found.</p>
      ) : (
        <div className="overflow-x-auto shadow-xl border rounded-lg">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-red-100 text-left">
              <tr>
                <th className="px-4 py-2 border">Train ID</th>
                <th className="px-4 py-2 border">Wheel ID</th>
                <th className="px-4 py-2 border">Side</th>
                <th className="px-4 py-2 border">Expected Replacement</th>
                <th className="px-4 py-2 border">RUL (days)</th>
                <th className="px-4 py-2 border">Install Date</th>
              </tr>
            </thead>
            <tbody>
              {alertData.map((item, index) => (
                <tr key={index} className="hover:bg-red-50 border-t">
                  <td className="px-4 py-2 border">{item.trainId}</td>
                  <td className="px-4 py-2 border">{item.wheelId}</td>
                  <td className="px-4 py-2 border">{item.side}</td>
                  <td className="px-4 py-2 border">{item.expectedDate.toDateString()}</td>
                  <td className="px-4 py-2 border">{item.rul.toFixed(1)}</td>
                  <td className="px-4 py-2 border">{item.installDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Alerts;
