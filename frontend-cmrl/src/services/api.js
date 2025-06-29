import axios from 'axios';

const NODE_API = import.meta.env.VITE_API_URL;       // MongoDB (Node backend)
const FLASK_API = import.meta.env.VITE_ML_API_URL;   // ML Predictions (Flask backend)

// ✅ Fetch raw wheel data from MongoDB
export const getWheelData = async (trainId) => {
  try {
    const res = await axios.get(`${NODE_API}/api/wheels/${trainId.toLowerCase()}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching wheel data:", error);
    throw error;
  }
};

// ✅ Fetch RUL prediction from ML model
export const getTrainPrediction = async (trainId) => {
  try {
    const res = await axios.get(`${FLASK_API}/predict/${trainId.toLowerCase()}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching prediction:", error);
    throw error;
  }
};
