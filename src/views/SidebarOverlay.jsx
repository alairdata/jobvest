import ATSResultCard from "../components/ATSResultCard";

const SidebarOverlay = ({ sidebarTailor, onClose }) => {
  const savedResume = (() => {
    try {
      const raw = localStorage.getItem("jobvest_saved_resume");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const keywords = ["Python", "ML", "SQL", "TensorFlow", "AWS", "GCP", "Tableau", "A/B Testing"];
  const tailorSteps = ["Reading JD", "Extracting keywords", "Matching skills", "Rewriting bullets", "Optimizing", "ATS check", "Finalizing"];
  const thresholds = [14, 32, 50, 68, 82, 95, 100];

  return (
    <div className="fixed inset-0 z-[100] flex bg-black/25 backdrop-blur-[2px]" onClick={onClose}>
      {/* Background page simulation */}
      <div
        className="hidden md:flex flex-1 p-10 overflow-auto bg-[#f8f9fa] font-[system-ui] text-[#1a1a1a] flex-col"
      >
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-[5px] bg-[#0a66c2] flex items-center justify-center text-white text-xs font-bold">
              in
            </div>
            <span className="text-xs text-[#888]">
              linkedin.com/jobs/view/3847291
            </span>
          </div>
          <h2 className="text-[22px] font-bold mb-1">Data Scientist</h2>
          <p className="text-sm text-[#666] mb-[3px]">
            Safaricom PLC · Nairobi, Kenya
          </p>
          <p className="text-xs text-[#999] mb-5">
            Posted 2 days ago · 47 applicants
          </p>
          <div className="h-px bg-[#e0e0e0] mb-5" />
          <h3 className="text-[15px] font-semibold mb-3">About the role</h3>
          <p className="text-[13px] text-[#555] leading-[1.8]">
            We are looking for a Data Scientist to join our Analytics & Insights
            team. Strong experience with Python, ML frameworks, SQL, and data
            visualization tools required.
          </p>
          <h3 className="text-[15px] font-semibold mt-5 mb-3">
            Requirements
          </h3>
          <div className="text-[13px] text-[#555] leading-[2]">
            <p>• MSc in Data Science or related field</p>
            <p>• 2+ years in data science or analytics</p>
            <p>• Python, TensorFlow/PyTorch, SQL</p>
            <p>• Cloud platforms (AWS/GCP)</p>
            <p>• Tableau, Power BI</p>
          </div>
        </div>
      </div>

      {/* Sidebar panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:w-[350px] bg-white border-l border-warm-border flex flex-col overflow-auto shadow-[-4px_0_24px_rgba(0,0,0,0.06)]"
      >
        {/* Sidebar header */}
        <div className="py-3.5 px-[18px] border-b border-warm-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-xs shadow-[0_2px_8px_rgba(59,130,246,0.25)]">
              ✧
            </div>
            <span className="text-sm font-bold">
              <span className="text-brand">Job</span>Vest
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-stone-400 cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {/* Pre-tailor state */}
        {!sidebarTailor.active && !sidebarTailor.done && (
          <div className="p-[18px] flex flex-col gap-3.5 flex-1">
            {/* Job detected */}
            <div className="p-3.5 rounded-xl bg-warm-bg border border-warm-border">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-[5px] h-[5px] rounded-full bg-green-600 shadow-[0_0_6px_rgba(22,163,106,0.4)]" />
                <span className="text-[9px] font-mono text-green-600 font-semibold tracking-[0.8px] uppercase">
                  Job Detected
                </span>
              </div>
              <p className="text-[13px] font-bold mb-px">Data Scientist</p>
              <p className="text-[11px] text-stone-500">
                Safaricom PLC · Nairobi
              </p>
            </div>

            {/* Keywords */}
            <div className="py-3 px-3.5 rounded-xl bg-warm-bg border border-warm-border">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-stone-500">
                  Extracted Keywords
                </span>
                <span className="text-[9px] text-stone-400 font-mono">
                  14 found
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="py-0.5 px-2 rounded-[10px] text-[9px] font-semibold bg-blue-50 text-blue-600 border border-blue-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Master resume */}
            <div className="py-3 px-3.5 rounded-xl bg-warm-bg border border-warm-border flex items-center gap-3">
              <span className="text-lg">📄</span>
              <div className="flex-1">
                <p className="text-xs font-semibold">Master Resume</p>
                <p className="text-[10px] text-stone-400 mt-0.5 font-mono">
                  {savedResume?.resumeFileName || "No resume saved"}
                </p>
              </div>
              {savedResume ? (
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              )}
            </div>

            {/* ATS preview */}
            <div className="py-3 px-3.5 rounded-xl bg-warm-bg border border-warm-border">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs">🤖</span>
                <span className="text-[10px] font-bold text-stone-500">
                  ATS Score for this job
                </span>
              </div>
              {[
                { l: "Current", v: "68%", w: "68%", c: "#dc2626" },
                { l: "After tailoring", v: "~83%", w: "83%", c: "#16a34a" },
              ].map((m, i) => (
                <div key={i} className={i === 0 ? "mb-2" : ""}>
                  <div className="flex justify-between mb-[3px]">
                    <span className="text-[10px] text-stone-500">{m.l}</span>
                    <span
                      className="text-[11px] font-mono font-semibold"
                      style={{ color: m.c }}
                    >
                      {m.v}
                    </span>
                  </div>
                  <div className="h-[3px] rounded-[3px] bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-[3px]"
                      style={{ width: m.w, background: m.c }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[9px] text-stone-400 mt-1.5">
                Safe zone: 80-85% · Above 95% risks looking like spam
              </p>
            </div>

            {/* Tailor button */}
            <div className="mt-auto">
              <button
                onClick={sidebarTailor.start}
                className="w-full py-3.5 rounded-xl border-none cursor-pointer text-[13px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(59,130,246,0.25)]"
              >
                ✧ Tailor Resume for This Role
              </button>
              <p className="text-[10px] text-stone-400 text-center mt-2">
                Takes ~3 min · Downloads as .docx
              </p>
            </div>
          </div>
        )}

        {/* Tailoring in progress */}
        {sidebarTailor.active && (
          <div className="py-7 px-5 flex flex-col items-center justify-center flex-1">
            <div className="w-[42px] h-[42px] rounded-xl mb-4 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-lg text-white animate-[sbp_2s_ease_infinite]">
              ✧
            </div>
            <h3 className="font-heading text-[15px] font-bold mb-[3px]">
              Tailoring...
            </h3>
            <p className="text-[11px] text-stone-400 mb-5">
              Optimizing ATS Score · Safaricom
            </p>
            <div className="w-full h-1 rounded bg-slate-100 overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-dark rounded transition-[width] duration-500 ease-out"
                style={{ width: `${sidebarTailor.progress}%` }}
              />
            </div>
            {tailorSteps.map((s, i) => {
              const done = sidebarTailor.progress >= thresholds[i];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 py-1 px-2 w-full"
                >
                  <div
                    className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${
                      done
                        ? "bg-green-50 text-green-600"
                        : "bg-stone-100 text-stone-300"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[10px] ${
                      done ? "text-stone-600" : "text-stone-300"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tailor done */}
        {sidebarTailor.done && (
          <div className="py-6 px-[18px] flex flex-col items-center flex-1">
            <div className="w-[42px] h-[42px] rounded-xl mb-3.5 bg-green-50 flex items-center justify-center text-xl text-green-600">
              ✓
            </div>
            <h3 className="font-heading text-base font-bold mb-[3px]">
              Resume Ready!
            </h3>
            <p className="text-[11px] text-stone-500 mb-4">
              Tailored for Safaricom
            </p>
            <ATSResultCard before={68} after={83} />
            <div className="w-full mb-4 mt-1.5">
              {[
                "6 bullets rewritten with metrics",
                "4 keywords added naturally",
                "Summary tailored to JD",
                "Skills reordered",
              ].map((t, i) => (
                <div key={i} className="flex gap-2 items-center py-[3px]">
                  <span className="text-green-600 text-[11px]">✓</span>
                  <span className="text-[10px] text-stone-600">{t}</span>
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col gap-1.5 mt-auto">
              <button className="w-full py-[13px] rounded-xl border-none cursor-pointer text-[13px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(59,130,246,0.2)]">
                ↓ Download .docx
              </button>
              <button className="w-full py-[11px] rounded-xl border border-stone-200 cursor-pointer text-xs font-semibold font-sans bg-white text-stone-600">
                ↓ Download .pdf
              </button>
              <button
                onClick={() => {
                  onClose();
                  sidebarTailor.reset();
                }}
                className="w-full py-2 rounded-lg border-none cursor-pointer text-[11px] text-stone-400 bg-transparent"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarOverlay;
