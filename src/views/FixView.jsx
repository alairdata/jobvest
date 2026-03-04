import { useState } from "react";
import { getStrengthMeta } from "../utils/scoring";
import { fixFeedback as defaultFeedback } from "../data/feedback";
import ScoreGauge from "../components/ScoreGauge";
import ScoreTypeBadge from "../components/ScoreTypeBadge";
import FeedbackItem from "../components/FeedbackItem";

const FixView = ({
  expandedFeedback,
  setExpandedFeedback,
  onReset,
  setMode,
  resumeFileName,
  resumeFile,
  resumeFileUrl,
  resumeFileType,
  resumeScore,
  resumeFeedback,
  analyzing,
  improving,
  improvedResumeUrl,
  improvedScore,
  improvedFeedback,
  onImproveResume,
  onUpdateResume,
  resumeText,
  candidateName,
}) => {
  const [showImproved, setShowImproved] = useState(true);
  const isPdf = resumeFileType === "application/pdf";
  const hasImproved = !!improvedResumeUrl;

  // Determine which data to show based on toggle
  const isShowingImproved = hasImproved && showImproved;
  const activeScore = isShowingImproved ? (improvedScore ?? 58) : (resumeScore ?? 58);
  const activeFeedback = isShowingImproved ? (improvedFeedback ?? defaultFeedback) : (resumeFeedback ?? defaultFeedback);
  const activeUrl = isShowingImproved ? improvedResumeUrl : resumeFileUrl;
  const activeFileName = isShowingImproved ? "Improved Resume" : resumeFileName;

  const meta = getStrengthMeta(activeScore);
  const isNonPdf = !isPdf && resumeFileType;

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-serif text-[28px] font-extrabold mb-1.5 text-[#1a1a1a]">
          Great job! Let's take a closer look <span className="text-brand">✦</span>
        </h1>
        <p className="text-sm text-stone-500">
          We'll help you fine-tune your resume to catch the eye of hiring managers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Resume Preview */}
        <div className="w-full md:flex-[1.2_1_460px] md:min-w-[380px] md:sticky md:top-4 md:self-start bg-white rounded-2xl border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 32px)" }}>
          <div className="py-3 px-[18px] bg-warm-bg border-b border-warm-border flex justify-between items-center shrink-0">
            <span className="text-[11px] font-semibold text-stone-500">📄 {activeFileName || "Resume Preview"}</span>
            <button
              onClick={() => {
                if (!activeUrl) return;
                const a = document.createElement("a");
                a.href = activeUrl;
                const safeName = candidateName ? candidateName.replace(/[^a-zA-Z\s]/g, "").trim().replace(/\s+/g, "_") : "";
                a.download = isShowingImproved
                  ? (safeName ? `${safeName}_Resume.pdf` : "Improved_Resume.pdf")
                  : (resumeFileName || "Resume.pdf");
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              disabled={!activeUrl}
              className="py-1 px-2.5 rounded-md border border-stone-200 bg-white text-stone-600 text-[10px] font-semibold cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>

          {/* Original / Improved toggle */}
          {hasImproved && (
            <div className="flex items-center justify-center gap-1 py-2.5 px-4 bg-stone-50 border-b border-warm-border shrink-0">
              <button
                onClick={() => setShowImproved(false)}
                className={`py-1.5 px-4 rounded-full text-[11px] font-semibold cursor-pointer font-sans border-none transition-colors ${
                  !showImproved
                    ? "bg-white text-stone-800 shadow-sm"
                    : "bg-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setShowImproved(true)}
                className={`py-1.5 px-4 rounded-full text-[11px] font-semibold cursor-pointer font-sans border-none transition-colors ${
                  showImproved
                    ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-sm"
                    : "bg-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                Improved
              </button>
            </div>
          )}

          {isShowingImproved && (
            <div className="py-2.5 px-4 bg-amber-50 border-b border-amber-200 flex gap-2 items-start shrink-0">
              <span className="text-sm shrink-0">⚠️</span>
              <p className="text-[10px] text-amber-800 leading-relaxed">
                <strong>Review before using:</strong> Bullets marked with [*] contain estimated numbers. Update them with your real figures before submitting applications.
              </p>
            </div>
          )}

          {isPdf && activeUrl ? (
            <iframe
              src={`${activeUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              title="Resume Preview"
              className="w-full border-none block flex-1"
              style={{ minHeight: "calc(100vh - 100px)" }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-semibold text-stone-700 mb-1">{resumeFileName}</p>
              <p className="text-xs text-stone-400">
                Preview is available for PDF files. Your file has been uploaded successfully.
              </p>
            </div>
          )}
        </div>

        {/* Right: Score + Feedback */}
        <div className="w-full md:flex-[1_1_300px] md:min-w-[260px] flex flex-col gap-4">
          <div className="bg-white rounded-2xl py-7 px-6 border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)] text-center">
            <div className="flex justify-center mb-2.5">
              <ScoreTypeBadge type="strength" />
            </div>
            <h3 className="font-serif text-[17px] font-bold mb-1">
              Resume Strength Score
            </h3>
            <p className="text-[11px] text-stone-400">
              How compelling is your resume to human recruiters?
            </p>

            {improving ? (
              <div className="py-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-stone-200 border-t-brand rounded-full animate-spin" />
                <p className="text-sm text-stone-600 font-semibold">Improving your resume...</p>
                <p className="text-[11px] text-stone-400">This may take 10-15 seconds</p>
              </div>
            ) : analyzing ? (
              <div className="py-10 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-stone-200 border-t-brand rounded-full animate-spin" />
                <p className="text-xs text-stone-500 font-medium">Analyzing your resume...</p>
              </div>
            ) : (
              <>
                <ScoreGauge value={activeScore} type="strength" />
                <p className="text-[10px] font-medium mt-2.5" style={{ color: meta.color }}>
                  {meta.sub}
                </p>
                {isShowingImproved && improvedScore != null && resumeScore != null && improvedScore > resumeScore && (
                  <p className="text-[10px] font-semibold text-green-600 mt-1">
                    +{improvedScore - resumeScore} points improvement
                  </p>
                )}
              </>
            )}

            <div className="flex gap-2 mt-[22px]">
              <button
                onClick={onImproveResume}
                disabled={improving || analyzing || !isPdf || !resumeText}
                className="flex-1 py-3 px-2 rounded-[10px] border-none bg-gradient-to-br from-brand to-brand-dark text-white text-xs font-bold cursor-pointer font-sans shadow-[0_2px_10px_rgba(255,140,66,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {improving ? "Improving..." : hasImproved ? "Improve Again" : "Improve Resume"}
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-3 px-2 rounded-[10px] border-[1.5px] border-stone-200 bg-white text-stone-600 text-xs font-semibold cursor-pointer font-sans"
              >
                Upload & Rescan
              </button>
            </div>

            <button
              onClick={() => setMode("launch")}
              className="w-full py-3 rounded-[10px] border-none bg-[rgba(255,140,66,0.06)] text-orange-600 text-[13px] font-bold cursor-pointer font-sans mt-2.5 transition-colors hover:bg-[rgba(255,140,66,0.12)]"
            >
              Launch Job Search →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-warm-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.02)]">
            <p className="text-xs font-bold text-[#1a1a1a] mb-3">
              {isShowingImproved ? "Improved resume feedback:" : "What you should fix:"}
            </p>
            {analyzing || improving ? (
              <div className="py-6 flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-[2.5px] border-stone-200 border-t-brand rounded-full animate-spin" />
                <p className="text-[11px] text-stone-400">
                  {improving ? "Rewriting your resume..." : "Scanning sections..."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {isNonPdf && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-1">
                    PDF analysis not available for this file type. Upload a PDF for a detailed score.
                  </p>
                )}
                {activeFeedback.map((item, i) => (
                  <FeedbackItem
                    key={i}
                    item={item}
                    isOpen={expandedFeedback === `f${i}`}
                    onToggle={() =>
                      setExpandedFeedback(
                        expandedFeedback === `f${i}` ? null : `f${i}`
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixView;
