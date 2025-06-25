import React from "react";

const getChange = (before, after) => Math.abs(before - after);
const getColor = (value) => {
  if (value < 2) return "bg-green-200";
  if (value < 5) return "bg-yellow-300";
  if (value < 10) return "bg-orange-300";
  return "bg-red-500 text-white";
};

const Heatmap = ({ data }) => {
  const parameters = ["diameter", "flangeHeight", "flangeThickness", "qr"];

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
          {data.map((wheel, i) => (
            <tr key={i}>
              <td className="border p-2">{wheel.wheelId}</td>
              {parameters.map((param) => {
                const diff = getChange(wheel.before[param], wheel.after[param]);
                return (
                  <td className={`border p-2 ${getColor(diff)}`} key={param}>
                    {diff.toFixed(2)}
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
