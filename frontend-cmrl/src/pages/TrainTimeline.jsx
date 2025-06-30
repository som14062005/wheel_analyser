import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Wrench, AlertTriangle } from 'lucide-react';

const WheelReplacementUI = () => {
  const { trainId } = useParams();
  const [wheelData, setWheelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWheelData = async () => {
    setError(null);
    try {
      const trimmedId = parseInt(trainId.replace("cmrltr", ""));
      const response = await fetch(`http://127.0.0.1:5001/predict/cmrltr${trimmedId}`);
      const rawData = await response.json();

      // ✅ Filter: only keep wheelId like L1-R1 and matching LH/RH install_date
      const filteredData = rawData.filter((wheel) => {
        const validWheelId = /^L\d+-R\d+$/.test(wheel.wheelId);
        const lhDate = wheel.after?.LH?.install_date;
        const rhDate = wheel.after?.RH?.install_date;
        const sameInstall = lhDate && rhDate && lhDate === rhDate;
        return validWheelId && sameInstall;
      });

      setWheelData(filteredData);
    } catch (err) {
      setError('Failed to fetch wheel data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWheelData();
  }, [trainId]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getDaysUntilReplacement = (dateStr) => {
    const today = new Date();
    const repDate = new Date(dateStr);
    return Math.ceil((repDate - today) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days) => {
    if (days <= 30) return 'bg-red-500';
    if (days <= 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUrgencyText = (days) => {
    if (days <= 30) return 'Critical';
    if (days <= 90) return 'Caution';
    return 'Normal';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{trainId.toUpperCase()} - Wheel Replacement Timeline</h1>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg">Loading wheel data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && wheelData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">Total Axles</h3>
                </div>
                <p className="text-3xl font-bold text-blue-400">{wheelData.length}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Avg RUL (Days)</h3>
                </div>
                <p className="text-3xl font-bold text-yellow-400">
                  {Math.round(
                    wheelData.reduce(
                      (sum, wheel) => sum + ((wheel.after?.LH?.rul_days || 0) + (wheel.after?.RH?.rul_days || 0)) / 2,
                      0
                    ) / wheelData.length
                  )}
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold">Critical (&lt;30 days)</h3>
                </div>
                <p className="text-3xl font-bold text-red-400">
                  {
                    wheelData.filter(
                      (wheel) =>
                        getDaysUntilReplacement(wheel.after?.LH?.expected_replacement_date) <= 30 ||
                        getDaysUntilReplacement(wheel.after?.RH?.expected_replacement_date) <= 30
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {wheelData.map((wheel) => {
                const lhDays = getDaysUntilReplacement(wheel.after?.LH?.expected_replacement_date);
                const rhDays = getDaysUntilReplacement(wheel.after?.RH?.expected_replacement_date);

                return (
                  <div key={wheel.wheelId} className="bg-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-blue-400 mb-4">{wheel.wheelId}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-semibold">Left Hand (LH)</h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${getUrgencyColor(lhDays)} text-white`}>
                            {getUrgencyText(lhDays)}
                          </span>
                        </div>
                        <p>Install: {formatDate(wheel.after?.LH?.install_date)}</p>
                        <p>Replace: {formatDate(wheel.after?.LH?.expected_replacement_date)}</p>
                        <p className="mt-2 text-yellow-300 font-bold">Days Remaining: {lhDays}</p>
                        <div className="h-2 mt-2 bg-slate-600 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getUrgencyColor(lhDays)}`}
                            style={{ width: `${Math.max(5, Math.min(100, (lhDays / 365) * 100))}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-semibold">Right Hand (RH)</h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${getUrgencyColor(rhDays)} text-white`}>
                            {getUrgencyText(rhDays)}
                          </span>
                        </div>
                        <p>Install: {formatDate(wheel.after?.RH?.install_date)}</p>
                        <p>Replace: {formatDate(wheel.after?.RH?.expected_replacement_date)}</p>
                        <p className="mt-2 text-yellow-300 font-bold">Days Remaining: {rhDays}</p>
                        <div className="h-2 mt-2 bg-slate-600 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getUrgencyColor(rhDays)}`}
                            style={{ width: `${Math.max(5, Math.min(100, (rhDays / 365) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WheelReplacementUI;
