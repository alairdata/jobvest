import { allStatuses } from "../data/applications";

const StatusMenu = ({ currentStatus, isOpen, onToggle, onSelect }) => {
  return (
    <div className="self-center justify-self-center relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="bg-transparent border-none cursor-pointer text-base text-stone-400 px-1.5 py-1 rounded-md leading-none transition-colors hover:bg-stone-100"
      >
        ⋮
      </button>

      {isOpen && (
        <>
          <div
            onClick={onToggle}
            className="fixed inset-0 z-[60]"
          />
          <div className="absolute right-0 top-full mt-1 z-[70] bg-white rounded-xl border border-warm-border shadow-[0_4px_20px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] p-1.5 min-w-[150px]">
            <p className="text-[9px] font-bold text-stone-400 px-2.5 pt-1.5 pb-1 tracking-[0.5px] uppercase">
              Update status
            </p>
            {allStatuses.map((s) => (
              <button
                key={s.key}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(s.key);
                }}
                className="flex items-center gap-2 w-full py-2 px-2.5 border-none rounded-lg cursor-pointer text-left transition-colors hover:bg-[#fafaf8]"
                style={{
                  background: currentStatus === s.key ? s.bg : "transparent",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: s.text }}
                />
                <span
                  className="text-xs text-[#1a1a1a]"
                  style={{ fontWeight: currentStatus === s.key ? 700 : 500 }}
                >
                  {s.label}
                </span>
                {currentStatus === s.key && (
                  <span className="ml-auto text-[11px]" style={{ color: s.text }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusMenu;
