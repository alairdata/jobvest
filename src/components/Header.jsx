const Header = ({
  tab,
  setTab,
  onOpenSidebar,
  onOpenSettings,
  user,
  isAuthenticated,
  profileName,
}) => {
  const initials = (profileName || user?.email || "?")
    .split(/[\s@]+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2) || "?";

  return (
    <header className="py-3.5 px-3 sm:px-7 bg-white border-b border-warm-border flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-sm font-bold shadow-[0_2px_8px_rgba(255,140,66,0.25)]">
          ✧
        </div>
        <span className="text-[17px] font-bold tracking-tight hidden sm:inline">
          <span className="text-brand">Job</span>
          <span className="text-[#1a1a1a]">Vest</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[
          { id: "home", label: "Get Started" },
          { id: "log", label: "Application Log" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-[7px] px-2 sm:px-4 rounded-lg border-none cursor-pointer text-[11px] sm:text-[13px] font-semibold font-sans ${
              tab === t.id
                ? "bg-orange-50 text-orange-600"
                : "bg-transparent text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={onOpenSidebar}
          className="py-2 px-3 sm:px-4 rounded-[10px] border-none bg-gradient-to-br from-brand to-brand-dark text-white text-xs font-bold cursor-pointer font-sans shadow-[0_2px_10px_rgba(255,140,66,0.25)] flex items-center gap-1.5"
        >
          ◎ <span className="hidden sm:inline">Sidebar</span>
        </button>

        {/* User avatar / settings button */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-[10px] border border-stone-200 bg-white flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors overflow-hidden"
          title={isAuthenticated ? (profileName || user?.email) : "Settings"}
        >
          {isAuthenticated ? (
            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-[11px] font-bold">
              {initials}
            </div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
