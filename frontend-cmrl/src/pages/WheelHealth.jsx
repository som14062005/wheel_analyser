import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import whtImage from '../assets/WHT.png';

const TrainTracker = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = 'black';
    return () => {
      document.body.style.minHeight = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const trainData = useMemo(() => {
    const totalTrains = 52;
    return Array.from({ length: totalTrains }, (_, i) => {
      const id = `CMRLTR${(i % 10) + 1}`;
      const status = i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'normal';
      return { id, status };
    });
  }, []);

  const filteredTrains = useMemo(() => {
    return trainData.filter(train =>
      train.id.toUpperCase().includes(searchValue.toUpperCase())
    );
  }, [trainData, searchValue]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleTrainClick = (trainId) => {
    navigate('/axle', { state: { trainId } });
  };

  return (
    <div
      className="min-h-[100vh] flex flex-col items-center pt-[150px] pb-10 px-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/bg1.png')" }}
    >
      {/* Search Box */}
      <div className="w-full max-w-3xl mb-10 px-4">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search Train ID..."
          className="w-full px-6 py-4 border-2 border-blue-700 rounded-full text-lg text-gray-800 outline-none bg-gray-50 transition-all duration-300 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Train Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 p-2 justify-items-center">
        {filteredTrains.map((train, index) => (
          <div
            key={index}
            onClick={() => handleTrainClick(train.id)}
            className="bg-white rounded-2xl shadow-lg p-5 text-center transition-all duration-300 w-38 cursor-pointer border border-transparent hover:-translate-y-1 hover:border-blue-700 hover:shadow-xl"
          >
            <img
              src={whtImage}
              alt="Train Icon"
              className="w-20 h-20 object-contain mb-2 mx-auto rounded-full border-2 border-gray-200"
            />
            <div className="mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-700 text-white inline-block shadow-md">
              {train.id}
            </div>
          </div>
        ))}
      </div>

      {filteredTrains.length === 0 && (
        <div className="text-center mt-10 text-white text-lg">
          No trains found matching "{searchValue}"
        </div>
      )}
    </div>
  );
};

export default TrainTracker;
