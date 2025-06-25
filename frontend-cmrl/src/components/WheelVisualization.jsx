import React from 'react';

// Standards for wheel parameters
const STANDARDS = {
  diameter: { new: 860, rejection: 780, maintenance: 790 },
  flangeThickness: { new: 32.5, rejection: 27.5, maintenance: 28.5 },
  flangeHeight: { new: 29, rejection: 36, maintenance: 35 },
  qr: { new: 10, rejection: 6.5, maintenance: 7.5 },
};

const blinkingStyle = {
  display: 'inline-block',
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: 'red',
  animation: 'blink 1s infinite',
  marginLeft: '8px',
};

const styles = `
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;

function WheelParameter({ label, value, danger }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="font-semibold w-[160px]">{label}:</div>
      <div className="w-[80px]">{value.toFixed(2)} mm</div>
      {danger && <span style={blinkingStyle} title="Danger! Parameter out of safe range"></span>}
    </div>
  );
}

function checkDanger(param, value) {
  switch (param) {
    case 'diameter': return value < STANDARDS.diameter.maintenance;
    case 'flangeThickness': return value < STANDARDS.flangeThickness.maintenance;
    case 'flangeHeight': return value > STANDARDS.flangeHeight.maintenance;
    case 'qr': return value < STANDARDS.qr.maintenance || value > STANDARDS.qr.new;
    default: return false;
  }
}

const StandardsTable = () => {
  return (
    <div className="mb-8 p-6 bg-white border rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center">Wheel Standards & Limits</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
              <th className="border border-gray-300 px-4 py-2 text-center">New Wheel</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Maintenance Limit</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Rejection Limit</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Diameter</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{STANDARDS.diameter.new}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-yellow-600 font-semibold">{STANDARDS.diameter.maintenance}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-red-600 font-semibold">{STANDARDS.diameter.rejection}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">mm</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">Flange Thickness</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{STANDARDS.flangeThickness.new}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-yellow-600 font-semibold">{STANDARDS.flangeThickness.maintenance}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-red-600 font-semibold">{STANDARDS.flangeThickness.rejection}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">mm</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-semibold">Flange Height</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{STANDARDS.flangeHeight.new}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-yellow-600 font-semibold">{STANDARDS.flangeHeight.maintenance}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-red-600 font-semibold">{STANDARDS.flangeHeight.rejection}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">mm</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">Flange Gradient (qr)</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{STANDARDS.qr.new}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-yellow-600 font-semibold">{STANDARDS.qr.maintenance}</td>
              <td className="border border-gray-300 px-4 py-2 text-center text-red-600 font-semibold">{STANDARDS.qr.rejection}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">mm</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Maintenance Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Critical - Reject</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={blinkingStyle}></span>
            <span>Danger Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WheelVisualization = ({ wheelData }) => {
  if (!wheelData) return null;
  const { before, after, wheelId } = wheelData;

  return (
    <>
      <style>{styles}</style>
      <div className="max-w-6xl mx-auto">
        {/* Standards Table */}
        <StandardsTable />
        
        {/* Wheel Visualization */}
        <div className="p-6 border rounded-lg bg-gray-50 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Wheel Visualization & Danger Alert - {wheelId}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before Maintenance */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-4 text-blue-700 text-lg border-b pb-2">Before Maintenance</h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-blue-600">Left Wheel (LH)</h4>
                <WheelParameter label="Diameter" value={before.LH.diameter} danger={checkDanger('diameter', before.LH.diameter)} />
                <WheelParameter label="Flange Thickness" value={before.LH.flangeThickness} danger={checkDanger('flangeThickness', before.LH.flangeThickness)} />
                <WheelParameter label="Flange Height" value={before.LH.flangeHeight} danger={checkDanger('flangeHeight', before.LH.flangeHeight)} />
                <WheelParameter label="Flange Gradient (qr)" value={before.LH.qr} danger={checkDanger('qr', before.LH.qr)} />
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Right Wheel (RH)</h4>
                <WheelParameter label="Diameter" value={before.RH.diameter} danger={checkDanger('diameter', before.RH.diameter)} />
                <WheelParameter label="Flange Thickness" value={before.RH.flangeThickness} danger={checkDanger('flangeThickness', before.RH.flangeThickness)} />
                <WheelParameter label="Flange Height" value={before.RH.flangeHeight} danger={checkDanger('flangeHeight', before.RH.flangeHeight)} />
                <WheelParameter label="Flange Gradient (qr)" value={before.RH.qr} danger={checkDanger('qr', before.RH.qr)} />
              </div>
            </div>

            {/* After Maintenance */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold mb-4 text-green-700 text-lg border-b pb-2">After Maintenance</h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-green-600">Left Wheel (LH)</h4>
                <WheelParameter label="Diameter" value={after.LH.diameter} danger={checkDanger('diameter', after.LH.diameter)} />
                <WheelParameter label="Flange Thickness" value={after.LH.flangeThickness} danger={checkDanger('flangeThickness', after.LH.flangeThickness)} />
                <WheelParameter label="Flange Height" value={after.LH.flangeHeight} danger={checkDanger('flangeHeight', after.LH.flangeHeight)} />
                <WheelParameter label="Flange Gradient (qr)" value={after.LH.qr} danger={checkDanger('qr', after.LH.qr)} />
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Right Wheel (RH)</h4>
                <WheelParameter label="Diameter" value={after.RH.diameter} danger={checkDanger('diameter', after.RH.diameter)} />
                <WheelParameter label="Flange Thickness" value={after.RH.flangeThickness} danger={checkDanger('flangeThickness', after.RH.flangeThickness)} />
                <WheelParameter label="Flange Height" value={after.RH.flangeHeight} danger={checkDanger('flangeHeight', after.RH.flangeHeight)} />
                <WheelParameter label="Flange Gradient (qr)" value={after.RH.qr} danger={checkDanger('qr', after.RH.qr)} />
              </div>
            </div>
          </div>
          
          {/* Timestamp Information */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Last Updated: {new Date(after.LH.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WheelVisualization;