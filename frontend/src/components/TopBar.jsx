const TopBar = ({ title, subtitle }) => (
  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-3xl font-extrabold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
    </div>
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
      Multiple Training Management System
    </div>
  </div>
);

export default TopBar;
