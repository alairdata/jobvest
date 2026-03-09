const Logo = ({ size = 20 }) => (
  <svg width={size} height={size * 1.22} viewBox="0 0 64 78" fill="none">
    <defs>
      <linearGradient id={`jvh-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path d="M32 4 L56 14 L56 42 C56 58 44 68 32 74 C20 68 8 58 8 42 L8 14 Z" fill="none" stroke={`url(#jvh-${size})`} strokeWidth="3" />
    <path d="M32 14 L18 22 L26 26 L32 40 Z" fill="#3b82f6" opacity="0.85" />
    <path d="M32 14 L46 22 L38 26 L32 40 Z" fill="#60a5fa" opacity="0.85" />
    <path d="M18 22 L12 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 22 L52 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="48" r="2" fill="#3b82f6" />
    <circle cx="32" cy="58" r="2" fill="#3b82f6" />
  </svg>
);

const Header = ({
  tab,
  setTab,
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-navy to-brand-deep flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.25)]">
          <Logo size={16} />
        </div>
        <span className="text-[17px] font-bold tracking-tight hidden sm:inline font-heading" style={{ letterSpacing: "-0.5px" }}>
          <span className="text-brand-light">Job</span>
          <span className="text-brand">Vest</span>
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
                ? "bg-blue-50 text-blue-600"
                : "bg-transparent text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-[10px] border border-stone-200 bg-white flex items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors overflow-hidden"
          title={isAuthenticated ? (profileName || user?.email) : "Settings"}
        >
          {isAuthenticated ? (
            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-brand-navy to-brand-deep flex items-center justify-center text-white text-[11px] font-bold">
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
