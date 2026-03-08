import { useState, useEffect } from "react";
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
  resumeScore,
  resumeText,
  jdText,
  setJdText,
  atsScore,
  setAtsScore,
  atsFeedback,
  setAtsFeedback,
  onTailorResume,
  tailoredResumeUrl,
  tailoredCandidateName,
  tailoredAtsScore,
}) => {
  const [scoring, setScoring] = useState(false);
  // 0 = not scored, 1 = score result, 2 = detailed findings, 3 = tailoring, 4 = done
  const [matchStep, setMatchStep] = useState(0);
  const [mismatchReason, setMismatchReason] = useState(null);

  // Auto-advance to step 4 when both animation and API call are done
  useEffect(() => {
    if (quickTailor.done && tailoredResumeUrl && matchStep === 3) setMatchStep(4);
  }, [quickTailor.done, tailoredResumeUrl, matchStep]);

  const strength = resumeScore ?? launchStrength;
  const meta = getStrengthMeta(strength);

  // Only show real ATS score — no fallback to resume strength
  const gaugeScore = atsScore;
  const atsMeta = atsScore !== null ? getATSMeta(atsScore) : null;

  // Real post-tailor score from background re-scoring
  const afterScore = tailoredAtsScore;

  const handleScoreMatch = async () => {
    if (!jdText.trim() || !resumeText || scoring) return;
    setScoring(true);
    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to score resume");
      }
      const data = await res.json();
      setAtsScore(data.score);
      setAtsFeedback(data.feedback);
      setMismatchReason(data.mismatchReason || null);
      setMatchStep(1);

      // If decent match (but not already excellent), start tailoring in the background
      if (data.score >= 50 && data.score < 85) {
        onTailorResume().catch(() => {});
      }
    } catch (err) {
      alert("Scoring failed: " + err.message);
    } finally {
      setScoring(false);
    }
  };

  const handleJdChange = (e) => {
    setJdText(e.target.value);
    // Keep quickTailorJD in sync for tailor button flow
    if (e.target.value.trim() && !quickTailorJD) setQuickTailorJD(true);
    if (!e.target.value.trim() && quickTailorJD) setQuickTailorJD(false);
    // Reset score when JD changes
    if (atsScore !== null) {
      setAtsScore(null);
      setAtsFeedback(null);
      setMismatchReason(null);
      setMatchStep(0);
    }
  };

  // Determine score bar colors
  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 70) return "#2563eb";
    if (score >= 60) return "#d97706";
    return "#dc2626";
  };

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
              <span className="font-bold font-mono" style={{ color: meta.color }}>
                {strength}%
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

          {/* Check Your Job Match */}
          <div className="p-6 rounded-2xl bg-white border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <h3 className="font-serif text-[17px] font-bold mb-[3px]">
                  Check Your Job Match
                </h3>
                <p className="text-xs text-stone-500">
                  Paste a job description → see how well your resume matches
                </p>
              </div>
              <ScoreTypeBadge type="ats" />
            </div>
            <p className="text-[10px] text-stone-400 mt-1 mb-3.5 leading-relaxed">
              Your Resume Strength is {strength}% — but each job needs a
              different keyword mix. The ATS Score measures how well your resume
              matches a specific job description.
            </p>

            {/* JD textarea */}
            <textarea
              value={jdText}
              onChange={handleJdChange}
              placeholder="Paste a job description here..."
              className={`w-full p-4 rounded-xl min-h-[90px] bg-warm-bg resize-y mb-3.5 border-[1.5px] border-dashed text-xs leading-[1.7] text-stone-700 font-sans placeholder:text-stone-400 focus:outline-none focus:border-brand ${
                jdText.trim() ? "border-brand" : "border-stone-200"
              }`}
              rows={4}
            />

            {/* Score My Match button */}
            {jdText.trim() && matchStep === 0 && (
              <button
                onClick={handleScoreMatch}
                disabled={scoring || !resumeText}
                className="w-full py-[13px] rounded-xl border-none cursor-pointer text-sm font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(255,140,66,0.2)] mb-3.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scoring ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scoring...
                  </>
                ) : (
                  "✧ Score My Match"
                )}
              </button>
            )}

            {/* Step indicator — hidden for poor matches and perfect fits */}
            {matchStep >= 1 && !(matchStep === 1 && atsScore < 50) && !(matchStep === 1 && atsScore >= 85) && (
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (s <= matchStep && s < 3) setMatchStep(s);
                      }}
                      className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border-none cursor-pointer font-sans transition-all ${
                        s === matchStep || (s === 3 && matchStep >= 3)
                          ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_1px_4px_rgba(255,140,66,0.3)]"
                          : s < matchStep || matchStep >= 3
                            ? "bg-green-100 text-green-600"
                            : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {(s < matchStep || (matchStep >= 3 && s < 3)) ? "✓" : s}
                    </button>
                    {s < 3 && (
                      <div className={`w-8 h-0.5 rounded ${s < matchStep || matchStep >= 3 ? "bg-green-200" : "bg-stone-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Score Result */}
            {matchStep === 1 && atsScore !== null && (
              <div>
                {atsScore < 50 ? (
                  /* Poor match — block tailoring */
                  <div>
                    <div className="p-3.5 rounded-[10px] bg-red-50 border border-red-200 mb-3.5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs">⚠️</span>
                        <span className="text-[10px] font-bold text-red-600">
                          Poor Match — {atsScore}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded bg-red-100 overflow-hidden mb-3">
                        <div
                          className="h-full rounded bg-red-500 transition-[width] duration-500"
                          style={{ width: `${atsScore}%` }}
                        />
                      </div>
                      {mismatchReason && (
                        <p className="text-[11px] text-red-700 leading-relaxed mb-2">
                          {mismatchReason}
                        </p>
                      )}
                      <p className="text-[10px] text-red-500 leading-relaxed">
                        Tailoring won't be enough to bridge this gap. We recommend revising your resume to better reflect this role before trying again.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAtsScore(null);
                        setAtsFeedback(null);
                        setMismatchReason(null);
                        setMatchStep(0);
                        setMode("fix");
                      }}
                      className="w-full py-[13px] rounded-xl border-none cursor-pointer text-sm font-bold font-sans bg-[#1a1a1a] text-white shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
                    >
                      ← Go Back & Revise Your Resume
                    </button>
                  </div>
                ) : atsScore >= 85 ? (
                  /* Excellent match — no tailoring needed */
                  <div>
                    <div className="p-3.5 rounded-[10px] bg-green-50 border border-green-200 mb-3.5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs">&#10024;</span>
                        <span className="text-[10px] font-bold text-green-700">
                          Perfect Fit — {atsScore}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded bg-green-100 overflow-hidden mb-3">
                        <div
                          className="h-full rounded bg-green-500 transition-[width] duration-500"
                          style={{ width: `${atsScore}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-green-700 leading-relaxed">
                        Your resume already covers the key requirements for this role. No tailoring needed — go ahead and apply!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setAtsScore(null);
                        setAtsFeedback(null);
                        setMismatchReason(null);
                        setMatchStep(0);
                        setJdText("");
                      }}
                      className="w-full py-[13px] rounded-xl border-none cursor-pointer text-sm font-bold font-sans bg-green-600 text-white shadow-[0_2px_12px_rgba(22,163,74,0.2)]"
                    >
                      Try Another Job Description
                    </button>
                  </div>
                ) : (
                  /* Decent match — continue to findings & tailor */
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
                        <span
                          className="text-[11px] font-mono font-semibold"
                          style={{ color: getScoreColor(atsScore) }}
                        >
                          {atsScore}%
                        </span>
                      </div>
                      <div className="h-1 rounded bg-slate-100 overflow-hidden mb-2">
                        <div
                          className="h-full rounded transition-[width] duration-500"
                          style={{
                            width: `${atsScore}%`,
                            backgroundColor: getScoreColor(atsScore),
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-stone-500">
                          After tailoring
                        </span>
                        {afterScore !== null ? (
                          <span className="text-[11px] font-mono text-green-600 font-semibold">
                            {afterScore}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border-[1.5px] border-stone-300 border-t-stone-500 rounded-full animate-spin" />
                            Calculating...
                          </span>
                        )}
                      </div>
                      <div className="h-1 rounded bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded transition-[width] duration-500 ${afterScore !== null ? "bg-green-600" : "bg-stone-300 animate-pulse"}`}
                          style={{ width: afterScore !== null ? `${afterScore}%` : "60%" }}
                        />
                      </div>
                      <p className="text-[9px] text-stone-400 mt-2">
                        {atsScore >= 80
                          ? "Your resume is a strong match for this role. Tailoring can fine-tune keyword placement."
                          : atsScore >= 60
                            ? "Your resume is decent, but this role needs keywords you haven't emphasized. Tailoring will fix that."
                            : "Significant keyword gaps detected. Tailoring will add missing terms and improve your match rate."}
                      </p>
                    </div>

                    <button
                      onClick={() => setMatchStep(2)}
                      disabled={afterScore === null}
                      className={`w-full py-[13px] rounded-xl border-none text-sm font-bold font-sans shadow-[0_2px_12px_rgba(255,140,66,0.2)] ${
                        afterScore === null
                          ? "opacity-50 cursor-not-allowed bg-stone-300 text-stone-500"
                          : "cursor-pointer bg-gradient-to-br from-brand to-brand-dark text-white"
                      }`}
                    >
                      {afterScore === null ? "Preparing results..." : "See What We Found →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Detailed Findings */}
            {matchStep === 2 && (
              <div>
                <p className="text-xs font-bold text-[#1a1a1a] mb-2">
                  ATS Analysis
                </p>
                {atsFeedback && atsFeedback.length > 0 && (
                  <div className="flex flex-col gap-1.5 mb-3.5">
                    {atsFeedback.map((item, i) => (
                      <FeedbackItem
                        key={i}
                        item={item}
                        isOpen={expandedFeedback === `ats${i}`}
                        onToggle={() =>
                          setExpandedFeedback(
                            expandedFeedback === `ats${i}` ? null : `ats${i}`
                          )
                        }
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={async () => {
                    // If tailoring already finished in background, skip to step 4
                    if (tailoredResumeUrl) {
                      setMatchStep(4);
                      return;
                    }
                    setMatchStep(3);
                    quickTailor.start();
                    // Tailoring was already kicked off in background after scoring,
                    // so we just wait for it. If it failed silently, retry.
                    if (!tailoredResumeUrl) {
                      try {
                        await onTailorResume();
                      } catch (err) {
                        alert("Tailoring failed: " + err.message);
                        setMatchStep(2);
                        quickTailor.reset();
                      }
                    }
                  }}
                  className="w-full py-[13px] rounded-xl border-none cursor-pointer text-sm font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(255,140,66,0.2)]"
                >
                  ✧ Tailor Now
                </button>
              </div>
            )}

            {/* Step 3: Tailoring in progress */}
            {matchStep === 3 && !(quickTailor.done && tailoredResumeUrl) && (
              <div className="text-center py-4">
                <div className="w-9 h-9 rounded-[10px] mx-auto mb-3 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-base text-white animate-[gp_2s_ease_infinite]">
                  ✧
                </div>
                <p className="text-[13px] font-semibold mb-1">
                  Tailoring for this role...
                </p>
                <p className="text-[11px] text-stone-400 mb-3.5">
                  {quickTailor.done && !tailoredResumeUrl
                    ? "Almost there — finalizing your tailored resume..."
                    : "Optimizing ATS Score · analyzing keywords"}
                </p>
                <div className="h-1 rounded bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand to-brand-dark rounded transition-[width] duration-500 ease-out"
                    style={{ width: `${quickTailor.done ? 95 : quickTailor.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Tailor done — download */}
            {matchStep === 4 && (
              <div>
                <ATSResultCard
                  before={atsScore ?? 68}
                  after={tailoredAtsScore ?? atsScore ?? 68}
                />
                <div className="mb-3.5 mt-2.5">
                  {[
                    "Bullets rewritten with role-specific metrics",
                    "Missing keywords added to relevant sections",
                    "Summary reframed around job requirements",
                    "Skills reordered to match JD priority",
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 items-center py-1">
                      <span className="text-green-600 text-[11px]">✓</span>
                      <span className="text-[11px] text-stone-600">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!tailoredResumeUrl) return;
                      const a = document.createElement("a");
                      a.href = tailoredResumeUrl;
                      const safeName = tailoredCandidateName
                        ? tailoredCandidateName.replace(/[^a-zA-Z\s]/g, "").trim().replace(/\s+/g, "_")
                        : "";
                      a.download = safeName
                        ? `${safeName}_Tailored_Resume.pdf`
                        : "Tailored_Resume.pdf";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    disabled={!tailoredResumeUrl}
                    className="flex-1 py-3 rounded-[10px] border-none cursor-pointer text-[13px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_10px_rgba(255,140,66,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↓ Download PDF
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
              {atsScore !== null
                ? "How well your resume matches this job description"
                : "How well does your resume pass automated screening?"}
            </p>
            {atsScore !== null ? (
              <>
                <ScoreGauge value={gaugeScore} type="ats" />
                <p
                  className="text-[10px] font-medium mt-2"
                  style={{ color: atsMeta.color }}
                >
                  {atsMeta.sub}
                </p>
              </>
            ) : (
              <div className="mx-auto mt-6 mb-4 text-center">
                <span className="text-5xl font-extrabold font-serif text-stone-200">—</span>
                <p className="text-[11px] font-bold mt-1 tracking-[1.5px] font-mono text-stone-300">
                  NOT SCORED
                </p>
                <p className="text-[10px] text-stone-400 mt-3">
                  Paste a job description to see your ATS score
                </p>
              </div>
            )}
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
              {atsFeedback ? "ATS Analysis:" : "What you should fix:"}
            </p>
            <div className="flex flex-col gap-1.5">
              {(atsFeedback || launchFeedback).map((item, i) => (
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
