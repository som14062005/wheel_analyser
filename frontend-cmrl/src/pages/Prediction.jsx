import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Needed for navigation

const TransitMap = () => {
  const navigate = useNavigate(); // ✅ hook for navigation

  const BACKGROUND_IMAGE = "wheel_health.jpg";

  const TRAIN_LOGOS = {};
  for (let i = 1; i <= 52; i++) {
    const trainId = `CMRLTR${i.toString().padStart(2, '0')}`;
    TRAIN_LOGOS[trainId] = `https://cdn1.expresscomputer.in/wp-content/uploads/2018/01/13101656/cmrl.jpg${trainId}.png`;
  }

 const [searchTerm, setSearchTerm] = useState('');

const stations = Array.from({ length: 52 }, (_, i) => {
  const trainId = `CMRLTR${i + 1}`; // ✅ No zero padding
  return {
    id: trainId,
    name: trainId,
    side: (i + 1) % 2 === 1 ? 'left' : 'right',
    trainLogo: TRAIN_LOGOS[trainId] || null
  };
});

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const backgroundStyle = {
    backgroundImage: `url(${BACKGROUND_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 z-0 rounded-3xl"></div>
      <div className="relative z-10 max-w-6xl mx-auto p-4 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            CMRL wheel Replacement Table
          </h1>
          <p className="text-white/80 text-lg drop-shadow">
            Chennai Metro Rail Limited - 52 Train Wheel prediction
          </p>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search trains (e.g., CMRLTRN01, CMRLTRN25)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm rounded-full text-gray-800 text-lg outline-none shadow-xl border border-white/30 focus:ring-4 focus:ring-blue-500/30"
          />
          <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-white/20">
        <div className="absolute inset-0 bg-black/30 z-0 rounded-3xl"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700 transform -translate-x-1/2 shadow-xl">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-500 to-gray-600"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-500 to-gray-600"></div>
            {Array.from({ length: Math.ceil(filteredStations.length / 1.5) }).map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-2 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 left-1/2 transform -translate-x-1/2 shadow-sm rounded-sm"
                style={{ top: `${(i * 100) / Math.ceil(filteredStations.length / 1.5)}%` }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 space-y-12">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="flex items-center justify-center relative cursor-pointer group"
                onClick={() => navigate(`/timeline/${station.name.toLowerCase()}`)} // ✅ Navigate on click
              >
                {station.side === 'left' ? (
                  <>
                    <div className="flex items-center mr-12 group-hover:scale-105 transition-transform">
                      <div className="bg-blue-600/90 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl border border-blue-400/30">
                        {station.name}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full border-4 border-blue-500 shadow-2xl"></div>
                    <div className="flex-1"></div>
                  </>
                ) : (
                  <>
                    <div className="flex-1"></div>
                    <div className="w-10 h-10 bg-white rounded-full border-4 border-blue-500 shadow-2xl"></div>
                    <div className="flex items-center ml-12 group-hover:scale-105 transition-transform">
                      <div className="bg-blue-600/90 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-xl border border-blue-400/30">
                        {station.name}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitMap;
