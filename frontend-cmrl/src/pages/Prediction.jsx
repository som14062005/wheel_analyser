import { useState } from "react";
import { getTrainPrediction } from "../services/api";
import TrainCard from "../components/Traincard"; // you should create this if not already done

const Prediction = () => {
  const [result, setResult] = useState(null);

  // 🔄 Your fetch function
  const fetchTrainRUL = async () => {
    try {
      const data = await getTrainPrediction("cmrltr2");
      setResult(data[0]); // only use first result
    } catch (error) {
      alert("Failed to fetch prediction.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Prediction Page</h2>

      <button
        onClick={fetchTrainRUL}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        🔮 Predict RUL for Train CMRLTR2
      </button>

      {result && (
        <div className="mt-6">
          <TrainCard train={result} />
        </div>
      )}
    </div>
  );
};

export default Prediction;
