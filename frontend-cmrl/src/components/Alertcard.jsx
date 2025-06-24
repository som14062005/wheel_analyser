// Alertcard.jsx
export default function AlertCard({ message, level }) {
  const color = level === 'critical' ? 'text-red-600' : 'text-yellow-600';
  return <div className={`p-3 border-l-4 ${color} bg-white shadow mb-2`}>{message}</div>;
}
