import { statusMap, allStatuses } from "../data/applications";
import { getATSMeta } from "../utils/scoring";
import StatusMenu from "../components/StatusMenu";

const LogView = ({ applications, appStatuses, updateStatus, openMenu, setOpenMenu }) => {
  const total = applications.length;
  const stages = [
    { label: "Applied", count: appStatuses.filter((s) => ["applied", "interview", "offered", "accepted", "pending"].includes(s)).length, color: "#60a5fa" },
    { label: "Screening", count: appStatuses.filter((s) => ["interview", "offered", "accepted", "pending"].includes(s)).length, color: "#3b82f6" },
    { label: "Interview", count: appStatuses.filter((s) => ["interview", "offered", "accepted"].includes(s)).length, color: "#2563eb" },
    { label: "Offered", count: appStatuses.filter((s) => ["offered", "accepted"].includes(s)).length, color: "#1e40af" },
    { label: "Accepted", count: appStatuses.filter((s) => s === "accepted").length, color: "#1e3a5f" },
  ];
  const max = Math.max(stages[0].count, 1);

  return (
    <div className="max-w-[900px] mx-auto py-8 px-3 sm:px-6">
      <h2 className="font-heading text-2xl font-bold mb-1">Application Log</h2>
      <p className="text-[13px] text-stone-500 mb-6">
        Track where you've applied and how your tailored resumes scored.
      </p>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-[14px] border border-warm-border p-6 mb-5">
        <p className="text-xs font-bold text-[#1a1a1a] mb-5">Your Pipeline</p>
        <div className="flex flex-col gap-1.5">
          {stages.map((stage, i) => {
            const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
            const barWidth = Math.max((stage.count / max) * 100, 12);
            return (
              <div key={i} className="flex items-center">
                <span className="text-[11px] font-semibold text-stone-500 w-[76px] text-right pr-3.5 shrink-0">
                  {stage.label}
                </span>
                <div className="flex-1 flex justify-center">
                  <div
                    className="h-9 rounded-md flex items-center justify-center transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-w-[40px]"
                    style={{
                      width: `${barWidth}%`,
                      background: stage.color,
                      opacity: stage.count === 0 ? 0.2 : 1,
                    }}
                  >
                    <span className="text-xs font-bold text-white font-mono">
                      {stage.count}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-stone-400 w-[52px] pl-3.5 shrink-0 font-mono">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Table */}
      <div className="bg-white rounded-[14px] border border-warm-border overflow-x-auto md:overflow-visible">
        <div className="min-w-[640px] grid grid-cols-[2fr_1fr_0.8fr_0.8fr_1fr_40px] py-2.5 px-5 border-b border-warm-border bg-warm-bg rounded-t-[14px]">
          {["Role", "Platform", "ATS Score", "Date", "Status", ""].map((h) => (
            <span
              key={h}
              className="text-[9px] font-bold text-stone-400 tracking-[0.8px] uppercase font-mono"
            >
              {h}
            </span>
          ))}
        </div>

        {applications.map((app, i) => {
          const currentStatus = appStatuses[i];
          const st = statusMap[currentStatus];
          const am = getATSMeta(app.ats);

          return (
            <div
              key={i}
              className="min-w-[640px] grid grid-cols-[2fr_1fr_0.8fr_0.8fr_1fr_40px] py-3.5 px-5 relative transition-colors hover:bg-warm-bg"
              style={{
                borderBottom:
                  i < applications.length - 1
                    ? "1px solid #f1f5f9"
                    : "none",
              }}
            >
              <div>
                <p className="text-[13px] font-semibold">{app.role}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {app.company}
                </p>
              </div>
              <span className="text-[11px] text-stone-500 self-center">
                {app.platform}
              </span>
              <div className="self-center flex items-center gap-[5px]">
                <div className="w-9 h-[3px] rounded-[3px] bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-[3px]"
                    style={{ width: `${app.ats}%`, background: am.color }}
                  />
                </div>
                <span
                  className="text-[10px] font-mono font-semibold"
                  style={{ color: am.color }}
                >
                  {app.ats}
                </span>
              </div>
              <span className="text-[11px] text-stone-400 self-center font-mono">
                {app.date}
              </span>
              <span
                className="py-[3px] px-2.5 rounded-2xl text-[10px] font-semibold self-center justify-self-start"
                style={{ background: st.bg, color: st.text }}
              >
                {st.label}
              </span>

              <StatusMenu
                currentStatus={currentStatus}
                isOpen={openMenu === i}
                onToggle={() => setOpenMenu(openMenu === i ? null : i)}
                onSelect={(newStatus) => updateStatus(i, newStatus)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogView;
