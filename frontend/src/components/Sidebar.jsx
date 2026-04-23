const Sidebar = ({ sections, activeSection, onSelect, user, onLogout }) => (
  <aside className="glass-panel flex w-full flex-col rounded-3xl border border-white/10 p-5 text-slate-100 shadow-card lg:w-72">
    <div className="mb-8">
      <p className="text-xs uppercase tracking-[0.35em] text-brand-200">L&D Platform</p>
      <h1 className="mt-3 text-2xl font-extrabold text-white">Training OS</h1>
      <p className="mt-2 text-sm text-slate-300">
        Centralize employee learning, assignments, and attendance in one place.
      </p>
    </div>

    <div className="mb-6 rounded-2xl bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</p>
      <p className="mt-2 text-lg font-semibold">{user?.name}</p>
      <p className="text-sm text-slate-300">{user?.role}</p>
    </div>

    <nav className="flex-1 space-y-2">
      {sections.map((section) => (
        <button
          key={section.key}
          type="button"
          onClick={() => onSelect(section.key)}
          className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
            activeSection === section.key
              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
              : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>

    <button
      type="button"
      onClick={onLogout}
      className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
    >
      Logout
    </button>
  </aside>
);

export default Sidebar;
