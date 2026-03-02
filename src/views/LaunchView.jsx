import { launchStrength, getStrengthMeta, getATSMeta } from "../utils/scoring";
import { launchFeedback } from "../data/feedback";
import { applications, statusMap } from "../data/applications";
import ScoreGauge from "../components/ScoreGauge";
import ScoreTypeBadge from "../components/ScoreTypeBadge";
import ATSResultCard from "../components/ATSResultCard";
import FeedbackItem from "../components/FeedbackItem";

const LaunchView = ({
  setMode,
  setHasResume,
  setTab,
  quickTailorJD,
  setQuickTailorJD,
  quickTailor,
  expandedFeedback,
  setExpandedFeedback,
  onOpenSidebar,
}) => {
  const meta = getStrengthMeta(launchStrength);
  const atsMeta = getATSMeta(launchStrength);

  return (
    <div className="max-w-[960px] mx-auto py-8 px-4 sm:px-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 px-4 sm:px-6 rounded-2xl mb-6 bg-gradient-to-br from-orange-50 to-[#fef3e2] border border-orange-300 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-xl shadow-[0_2px_10px_rgba(255,140,66,0.25)]">
            ✧
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-[22px] font-extrabold mb-0.5">
              Your job search is ready to be launched!
            </h1>
            <p className="text-[13px] text-stone-500">
              Strength:{" "}
              <span className="text-green-600 font-bold font-mono">
                {launchStrength}%
              </span>{" "}
              · Let's find your next role.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("fix")}
            className="py-2 px-3.5 rounded-lg border border-stone-200 bg-white text-stone-600 text-[11px] font-semibold cursor-pointer font-sans"
          >
            📄 View Resume
          </button>
          <button
            onClick={() => {
              setHasResume(false);
              setMode("fix");
            }}
            className="py-2 px-3.5 rounded-lg border border-stone-200 bg-white text-stone-600 text-[11px] font-semibold cursor-pointer font-sans"
          >
            ↺ Rescan
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left column */}
        <div className="w-full md:flex-[1_1_400px] md:min-w-[320px] flex flex-col gap-5">
          {/* Browser companion */}
          <div className="py-4 px-4 sm:px-5 rounded-[14px] bg-gradient-to-br from-warm-bg to-orange-50 border border-orange-300 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="w-[38px] h-[38px] rounded-[10px] shrink-0 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-base">
              ◎
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold mb-0.5 text-[#1a1a1a]">
                JobVest can follow you as you browse jobs
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Turn on the browser companion and tailor your resume with one
                click — on any job board, any listing.
              </p>
            </div>
            <button
              onClick={onOpenSidebar}
              className="py-2 px-4 rounded-lg border-none whitespace-nowrap bg-[#1a1a1a] text-white text-[11px] font-bold cursor-pointer font-sans"
            >
              Try it →
            </button>
          </div>

          {/* Quick Tailor */}
          <div className="p-6 rounded-2xl bg-white border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <h3 className="font-serif text-[17px] font-bold mb-[3px]">
                  Quick Tailor
                </h3>
                <p className="text-xs text-stone-500">
                  Paste a job description → tailored resume in minutes
                </p>
              </div>
              <ScoreTypeBadge type="ats" />
            </div>
            <p className="text-[10px] text-stone-400 mt-1 mb-3.5 leading-relaxed">
              Your Resume Strength is {launchStrength}% — but each job needs a
              different keyword mix. The ATS Score measures how well your resume
              matches a specific job description.
            </p>

            {/* JD input area */}
            <div
              onClick={() => setQuickTailorJD(!quickTailorJD)}
              className={`p-4 rounded-xl min-h-[90px] bg-warm-bg cursor-text mb-3.5 border-[1.5px] border-dashed ${
                quickTailorJD ? "border-brand" : "border-stone-200"
              }`}
            >
              {quickTailorJD ? (
                <p className="text-xs text-stone-700 leading-[1.7]">
                  <span className="font-bold text-brand">
                    Data Scientist — Safaricom PLC
                  </span>
                  <br />
                  Proficiency in Python, TensorFlow/PyTorch, SQL, cloud
                  platforms (AWS/GCP). Experience with A/B testing and
                  stakeholder management required...
                </p>
              ) : (
                <p className="text-xs text-stone-400">
                  Paste a job description here...
                </p>
              )}
            </div>

            {/* Pre-tailor state */}
            {quickTailorJD && !quickTailor.active && !quickTailor.done && (
              <div>
                <div className="p-3 px-3.5 rounded-[10px] bg-warm-bg border border-warm-border mb-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs">🤖</span>
                    <span className="text-[10px] font-bold text-stone-500">
                      ATS Score for this job:
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-stone-500">
                      Current match
                    </span>
                    <span className="text-[11px] font-mono text-red-600 font-semibold">
                      68%
                    </span>
                  </div>
                  <div className="h-1 rounded bg-slate-100 overflow-hidden mb-2">
                    <div className="h-full w-[68%] bg-red-600 rounded" />
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-stone-500">
                      After tailoring
                    </span>
                    <span className="text-[11px] font-mono text-green-600 font-semibold">
                      ~83%
                    </span>
                  </div>
                  <div className="h-1 rounded bg-slate-100 overflow-hidden">
                    <div className="h-full w-[83%] bg-green-600 rounded" />
                  </div>
                  <p className="text-[9px] text-stone-400 mt-2">
                    Your resume is strong, but this role needs keywords you
                    haven't emphasized. Tailoring will fix that.
                  </p>
                </div>
                <button
                  onClick={quickTailor.start}
                  className="w-full py-[13px] rounded-xl border-none cursor-pointer text-sm font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(255,140,66,0.2)]"
                >
                  ✧ Tailor Now
                </button>
              </div>
            )}

            {/* Tailoring in progress */}
            {quickTailor.active && (
              <div className="text-center py-4">
                <div className="w-9 h-9 rounded-[10px] mx-auto mb-3 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-base text-white animate-[gp_2s_ease_infinite]">
                  ✧
                </div>
                <p className="text-[13px] font-semibold mb-1">
                  Tailoring for this role...
                </p>
                <p className="text-[11px] text-stone-400 mb-3.5">
                  Optimizing ATS Score · Data Scientist · Safaricom
                </p>
                <div className="h-1 rounded bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-brand-dark rounded transition-[width] duration-500 ease-out"
                    style={{ width: `${quickTailor.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tailor done */}
            {quickTailor.done && (
              <div>
                <ATSResultCard before={68} after={83} />
                <div className="mb-3.5 mt-2.5">
                  {[
                    "6 bullets rewritten with role-specific metrics",
                    "4 keywords added (TensorFlow, AWS, GCP, A/B Testing)",
                    "Summary reframed around predictive modeling",
                    "Skills reordered to match JD priority",
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 items-center py-1">
                      <span className="text-green-600 text-[11px]">✓</span>
                      <span className="text-[11px] text-stone-600">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 rounded-[10px] border-none cursor-pointer text-[13px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_10px_rgba(255,140,66,0.2)]">
                    ↓ Download .docx
                  </button>
                  <button className="py-3 px-4 rounded-[10px] border border-stone-200 cursor-pointer text-xs font-semibold font-sans bg-white text-stone-600">
                    ↓ .pdf
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="py-5 px-6 rounded-2xl bg-white border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-3.5">
              <h3 className="font-serif text-[15px] font-bold">
                Recent Activity
              </h3>
              <button
                onClick={() => setTab("log")}
                className="py-[5px] px-3 rounded-lg border border-stone-200 bg-white text-stone-500 text-[11px] font-semibold cursor-pointer font-sans"
              >
                View all →
              </button>
            </div>
            {applications.slice(0, 3).map((app, i) => {
              const st = statusMap[app.status];
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between py-3 ${
                    i < 2 ? "border-b border-warm-divider" : ""
                  }`}
                >
                  <div>
                    <p className="text-[13px] font-semibold">{app.role}</p>
                    <p className="text-[11px] text-stone-400 mt-px">
                      {app.company} · {app.date}
                    </p>
                  </div>
                  <span
                    className="py-1 px-2.5 rounded-2xl text-[10px] font-semibold"
                    style={{ background: st.bg, color: st.text }}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Score + Feedback */}
        <div className="w-full md:flex-[0_1_300px] md:min-w-[260px] flex flex-col gap-4">
          <div className="bg-white rounded-2xl py-6 px-5 border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)] text-center">
            <div className="flex justify-center mb-1.5">
              <ScoreTypeBadge type="ats" />
            </div>
            <h3 className="font-serif text-[15px] font-bold mb-1">
              ATS Score
            </h3>
            <p className="text-[10px] text-stone-400">
              How well does your resume pass automated screening?
            </p>
            <ScoreGauge value={launchStrength} type="ats" />
            <p
              className="text-[10px] font-medium mt-2"
              style={{ color: atsMeta.color }}
            >
              {atsMeta.sub}
            </p>
            <p
              onClick={() => {
                setHasResume(false);
                setMode("fix");
              }}
              className="text-[11px] text-blue-600 mt-3 cursor-pointer font-medium"
            >
              ↺ Upload and rescan
            </p>
          </div>

          <div className="bg-white rounded-2xl p-[18px] border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)]">
            <p className="text-xs font-bold text-[#1a1a1a] mb-2.5">
              What you should fix:
            </p>
            <div className="flex flex-col gap-1.5">
              {launchFeedback.map((item, i) => (
                <FeedbackItem
                  key={i}
                  item={item}
                  isOpen={expandedFeedback === `l${i}`}
                  onToggle={() =>
                    setExpandedFeedback(
                      expandedFeedback === `l${i}` ? null : `l${i}`
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchView;
