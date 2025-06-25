import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getWheelData = async (trainId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/wheels/${trainId.toLowerCase()}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching wheel data:", error);
    throw error;
  }
};
