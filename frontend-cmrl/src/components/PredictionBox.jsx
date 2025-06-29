const PredictionBox = ({ state, side, data }) => {
  if (!data) return <div className="text-gray-400">No data</div>;

  const color = data.rul_days < 400 ? "bg-red-100" : data.rul_days < 600 ? "bg-yellow-100" : "bg-green-100";

  return (
    <div className={`p-4 border rounded-xl shadow-sm ${color}`}>
      <h3 className="font-semibold mb-1">{state.toUpperCase()} - {side}</h3>
      <p><strong>Install:</strong> {data.install_date}</p>
      <p><strong>Replace:</strong> {data.expected_replacement_date}</p>
      <p><strong>RUL:</strong> {data.rul_days.toFixed(2)} days</p>
    </div>
  );
};

export default PredictionBox;
