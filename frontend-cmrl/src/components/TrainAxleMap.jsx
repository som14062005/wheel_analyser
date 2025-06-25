import React, { useEffect, useState } from 'react';

// Standards for wheel parameters
const STANDARDS = {
  diameter: { new: 860, rejection: 780, maintenance: 790 },
  flangeThickness: { new: 32.5, rejection: 27.5, maintenance: 28.5 },
  flangeHeight: { new: 29, rejection: 36, maintenance: 35 },
  qr: { new: 10, rejection: 6.5, maintenance: 7.5 },
};

const TrainAxleMap = ({ trainId }) => {
  const [wheelData, setWheelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check if wheel is in danger based on current parameters
  const checkWheelDanger = (wheelData) => {
    if (!wheelData || !wheelData.after) return false;
    
    const { LH, RH } = wheelData.after;
    
    // Check left wheel
    const leftDanger = 
      LH.diameter < STANDARDS.diameter.maintenance ||
      LH.flangeThickness < STANDARDS.flangeThickness.maintenance ||
      LH.flangeHeight > STANDARDS.flangeHeight.maintenance ||
      LH.qr < STANDARDS.qr.maintenance;
    
    // Check right wheel
    const rightDanger = 
      RH.diameter < STANDARDS.diameter.maintenance ||
      RH.flangeThickness < STANDARDS.flangeThickness.maintenance ||
      RH.flangeHeight > STANDARDS.flangeHeight.maintenance ||
      RH.qr < STANDARDS.qr.maintenance;
    
    return leftDanger || rightDanger;
  };

  // Generate axle data for visualization
  const generateAxleData = () => {
    const axles = [];
    const leftAxles = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16'];
    const rightAxles = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16'];
    
    for (let i = 0; i < 16; i++) {
      const wheelId = `${leftAxles[i]}-${rightAxles[i]}`;
      const wheelInfo = wheelData.find(w => w.wheelId === wheelId);
      const isDangerous = wheelInfo ? checkWheelDanger(wheelInfo) : false;
      
      axles.push({
        left: leftAxles[i],
        right: rightAxles[i],
        wheelId,
        isDangerous,
        hasData: !!wheelInfo
      });
    }
    
    return axles;
  };

  useEffect(() => {
    if (!trainId || trainId === 'Unknown') {
      setLoading(false);
      setError('Train ID unknown');
      return;
    }

    const fetchWheelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/wheels/${trainId}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setWheelData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch wheel data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWheelData();
  }, [trainId]);

  if (loading) return <div className="text-center p-4">Loading wheel data...</div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;

  const axleData = generateAxleData();

  return (
    <>
      <style>{`
        @keyframes dangerBlink {
          0%, 50%, 100% { 
            background-color: #ef4444;
            box-shadow: 0 0 10px #ef4444;
          }
          25%, 75% { 
            background-color: #dc2626;
            box-shadow: 0 0 20px #dc2626;
          }
        }
        
        .danger-box {
          animation: dangerBlink 1s infinite;
        }
        
        .safe-box {
          background-color: #22c55e;
        }
        
        .no-data-box {
          background-color: #6b7280;
        }
      `}</style>
      
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center">Coloured Train Axle Map</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Axles 1-8 */}
            <div className="space-y-4">
              {axleData.slice(0, 8).map((axle, index) => (
                <div key={index} className="flex items-center justify-center gap-4">
                  <div className={`
                    w-16 h-12 border-2 border-black flex items-center justify-center font-bold text-white
                    ${axle.isDangerous ? 'danger-box' : axle.hasData ? 'safe-box' : 'no-data-box'}
                  `}>
                    {axle.left}
                  </div>
                  
                  {/* Axle representation */}
                  <div className="flex items-center">
                    <div className="w-6 h-8 bg-black"></div>
                    <div className="w-24 h-3 bg-black"></div>
                    <div className="w-6 h-8 bg-black"></div>
                  </div>
                  
                  <div className={`
                    w-16 h-12 border-2 border-black flex items-center justify-center font-bold text-white
                    ${axle.isDangerous ? 'danger-box' : axle.hasData ? 'safe-box' : 'no-data-box'}
                  `}>
                    {axle.right}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right side - Axles 9-16 */}
            <div className="space-y-4">
              {axleData.slice(8, 16).map((axle, index) => (
                <div key={index + 8} className="flex items-center justify-center gap-4">
                  <div className={`
                    w-16 h-12 border-2 border-black flex items-center justify-center font-bold text-white
                    ${axle.isDangerous ? 'danger-box' : axle.hasData ? 'safe-box' : 'no-data-box'}
                  `}>
                    {axle.left}
                  </div>
                  
                  {/* Axle representation */}
                  <div className="flex items-center">
                    <div className="w-6 h-8 bg-black"></div>
                    <div className="w-24 h-3 bg-black"></div>
                    <div className="w-6 h-8 bg-black"></div>
                  </div>
                  
                  <div className={`
                    w-16 h-12 border-2 border-black flex items-center justify-center font-bold text-white
                    ${axle.isDangerous ? 'danger-box' : axle.hasData ? 'safe-box' : 'no-data-box'}
                  `}>
                    {axle.right}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 border border-black"></div>
              <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 border border-black danger-box"></div>
              <span>Danger</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-500 border border-black"></div>
              <span>No Data</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainAxleMap;