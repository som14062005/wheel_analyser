import React from "react";

const getColor = (value) => {
  if (value == null) return "bg-gray-100 text-gray-400";
  if (value < 2) return "bg-green-200";
  if (value < 5) return "bg-yellow-300";
  if (value < 10) return "bg-orange-300";
  return "bg-red-500 text-white";
};

const Heatmap = ({ data }) => {
  const parameters = ["diameter", "flangeHeight", "flangeThickness", "qr"];

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No wheel data available for heatmap.</p>;
  }

  // Flatten into LH and RH rows
  const flattened = [];
  data.forEach(wheel => {
    if (wheel.before?.LH && wheel.after?.LH) {
      flattened.push({
        wheelId: `${wheel.wheelId}-LH`,
        side: 'LH',
        before: wheel.before.LH,
        after: wheel.after.LH
      });
    }
    if (wheel.before?.RH && wheel.after?.RH) {
      flattened.push({
        wheelId: `${wheel.wheelId}-RH`,
        side: 'RH',
        before: wheel.before.RH,
        after: wheel.after.RH
      });
    }
  });

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-bold my-4">Wheel Change Heatmap</h2>
      <table className="table-auto border border-gray-400 w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border p-2">Wheel ID</th>
            {parameters.map((param) => (
              <th className="border p-2 capitalize" key={param}>{param}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattened.map((wheel, i) => (
            <tr key={i}>
              <td className="border p-2">{wheel.wheelId}</td>
              {parameters.map((param) => {
                const beforeVal = wheel.before?.[param];
                const afterVal = wheel.after?.[param];
                const diff = beforeVal != null && afterVal != null ? Math.abs(beforeVal - afterVal) : null;
                return (
                  <td className={`border p-2 ${getColor(diff)}`} key={param}>
                    {diff != null ? diff.toFixed(2) : "N/A"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;
