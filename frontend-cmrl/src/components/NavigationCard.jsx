export default function NavigationCard({ title, subtitle, image, color, onClick }) {
  return (
    <div className={`rounded-3xl p-4 flex justify-between items-center cursor-pointer shadow-xl hover:scale-105 duration-200 ${color}`} onClick={onClick}>
      <img src={image} alt={title} className="w-24 h-24 rounded-xl" />
      <div className="ml-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
