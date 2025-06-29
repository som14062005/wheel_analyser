import PredictionBox from "./PredictionBox";

const TrainCard = ({ train }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        🚆 {train.TrainID} | Axle: {train.wheelId}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PredictionBox state="before" side="LH" data={train.before?.LH} />
        <PredictionBox state="before" side="RH" data={train.before?.RH} />
        <PredictionBox state="after" side="LH" data={train.after?.LH} />
        <PredictionBox state="after" side="RH" data={train.after?.RH} />
      </div>
    </div>
  );
};

export default TrainCard;
