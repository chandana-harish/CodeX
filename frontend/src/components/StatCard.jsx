const StatCard = ({ label, value, tone = "brand" }) => {
  const toneMap = {
    brand: "from-brand-500/30 to-brand-700/10 border-brand-300/20",
    emerald: "from-emerald-500/30 to-emerald-700/10 border-emerald-300/20",
    amber: "from-amber-500/30 to-amber-700/10 border-amber-300/20",
    sky: "from-sky-500/30 to-sky-700/10 border-sky-300/20"
  };

  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-5 shadow-card ${toneMap[tone]}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
