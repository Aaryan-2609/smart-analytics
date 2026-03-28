
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-5 shadow-md flex items-center gap-4 hover:shadow-purple-600 transition-all">
      <div className="text-purple-400">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-white text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
