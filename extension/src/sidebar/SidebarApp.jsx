import { useState, useEffect } from "react";
import { getATSMeta } from "../shared/scoring";
import { scoreResume, tailorResume } from "../shared/api";
import { getResume, addApplication } from "../shared/storage";
import { scrapeJobDescription } from "../content/scrapers/index";
import { useTailor } from "./hooks/useTailor";
import ScoreGauge from "./components/ScoreGauge";
import ATSResultCard from "./components/ATSResultCard";
import FeedbackItem from "./components/FeedbackItem";

/*  State machine:
    NO_RESUME → SCRAPING → SCRAPE_FAIL | SCORING → RESULT_LOW | RESULT_MID | RESULT_HIGH
    RESULT_MID → TAILORING → TAILOR_DONE
*/

const STATES = {
  NO_RESUME: "NO_RESUME",
  SCRAPING: "SCRAPING",
  SCRAPE_FAIL: "SCRAPE_FAIL",
  SCORING: "SCORING",
  RESULT_LOW: "RESULT_LOW",
  RESULT_MID: "RESULT_MID",
  RESULT_HIGH: "RESULT_HIGH",
  TAILORING: "TAILORING",
  TAILOR_DONE: "TAILOR_DONE",
};

const tailorSteps = ["Reading JD", "Extracting keywords", "Matching skills", "Rewriting bullets", "Optimizing", "ATS check", "Finalizing"];
const thresholds = [14, 32, 50, 68, 82, 95, 100];

const SidebarApp = ({ onClose }) => {
  const [state, setState] = useState(STATES.SCRAPING);
  const [resume, setResume] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [manualJD, setManualJD] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [mismatchReason, setMismatchReason] = useState(null);
  const [missedKeywords, setMissedKeywords] = useState([]);
  const [afterScore, setAfterScore] = useState(null);
  const [tailoredData, setTailoredData] = useState(null);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [markedApplied, setMarkedApplied] = useState(false);
  const [error, setError] = useState(null);

  const tailor = useTailor();

  // On mount: check resume + scrape
  useEffect(() => {
    (async () => {
      const r = await getResume();
      if (!r || !r.resumeText) {
        setState(STATES.NO_RESUME);
        return;
      }
      setResume(r);

      // Scrape JD from page
      const scraped = scrapeJobDescription();
      if (scraped.success) {
        setJobData(scraped);
        // Auto-score
        doScore(r.resumeText, scraped.description, scraped);
      } else {
        setState(STATES.SCRAPE_FAIL);
      }
    })();
  }, []);

  const doScore = async (resumeText, jdText, jd) => {
    setState(STATES.SCORING);
    try {
      const data = await scoreResume(resumeText, jdText);
      if (data.error) throw new Error(data.error);

      setAtsScore(data.score);
      setAtsFeedback(data.feedback);
      setMismatchReason(data.mismatchReason || null);
      setMissedKeywords(data.missedKeywords || []);

      if (jd && data.jobTitle) setJobData((prev) => ({ ...prev, title: data.jobTitle, company: data.company || prev?.company }));

      if (data.score < 50) setState(STATES.RESULT_LOW);
      else if (data.score >= 85) setState(STATES.RESULT_HIGH);
      else setState(STATES.RESULT_MID);
    } catch (err) {
      setError(err.message || "Scoring failed");
      setState(STATES.SCRAPE_FAIL);
    }
  };

  const handleManualScore = () => {
    if (!manualJD.trim() || !resume) return;
    setJobData({ title: "", company: "", description: manualJD, location: "", source: "manual" });
    doScore(resume.resumeText, manualJD, null);
  };

  const handleTailor = async () => {
    setState(STATES.TAILORING);
    tailor.start();
    try {
      const jdText = jobData?.description || manualJD;
      const [tailored, rescored] = await Promise.all([
        tailorResume(resume.resumeText, jdText),
        scoreResume(resume.resumeText, jdText).catch(() => null),
      ]);

      if (tailored.error) throw new Error(tailored.error);
      setTailoredData(tailored);

      // Re-score the tailored resume
      if (tailored.sections) {
        const tailoredText = tailored.sections.map((s) => {
          if (s.content) return `${s.title}\n${s.content}`;
          if (s.items) return `${s.title}\n${s.items.map((it) => `${it.title}\n${it.subtitle}\n${(it.bullets || []).join("\n")}`).join("\n")}`;
          return s.title;
        }).join("\n\n");

        try {
          const rescore = await scoreResume(tailoredText, jdText);
          setAfterScore(rescore.score || atsScore);
        } catch {
          setAfterScore(Math.min(atsScore + 15, 92));
        }
      }
    } catch (err) {
      setError(err.message || "Tailoring failed");
      setState(STATES.RESULT_MID);
      tailor.reset();
    }
  };

  // Auto-advance to TAILOR_DONE when animation + API both finish
  useEffect(() => {
    if (tailor.done && tailoredData && state === STATES.TAILORING) {
      setState(STATES.TAILOR_DONE);
    }
  }, [tailor.done, tailoredData, state]);

  const handleApplied = async () => {
    setMarkedApplied(true);
    await addApplication({
      role: jobData?.title || "Unknown Role",
      company: jobData?.company || "Unknown",
      status: "applied",
      ats: atsScore,
      platform: jobData?.source || "unknown",
    });
  };

  const handleDownload = () => {
    if (!tailoredData) return;
    // Generate a simple text download of the tailored resume
    let text = `${tailoredData.name || ""}\n${tailoredData.contact || ""}\n\n`;
    (tailoredData.sections || []).forEach((s) => {
      text += `${"=".repeat(40)}\n${s.title.toUpperCase()}\n${"=".repeat(40)}\n`;
      if (s.content) text += `${s.content}\n\n`;
      if (s.items) {
        s.items.forEach((it) => {
          text += `${it.title}\n${it.subtitle || ""}\n`;
          (it.bullets || []).forEach((b) => { text += `  - ${b}\n`; });
          text += "\n";
        });
      }
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(tailoredData.name || "Resume").replace(/[^a-zA-Z\s]/g, "").trim().replace(/\s+/g, "_")}_Tailored.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Render ---
  const s = {
    panel: { width: "360px", height: "100vh", position: "fixed", top: 0, right: 0, background: "white", borderLeft: "1px solid #f0ece6", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#1a1a1a", zIndex: 2147483647, boxShadow: "-4px 0 24px rgba(0,0,0,0.06)" },
    header: { padding: "14px 18px", borderBottom: "1px solid #f0ece6", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: "8px" },
    logoIcon: { width: "26px", height: "26px", borderRadius: "7px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", boxShadow: "0 2px 8px rgba(255,140,66,0.25)" },
    closeBtn: { background: "transparent", border: "none", color: "#a8a29e", cursor: "pointer", fontSize: "18px", padding: "4px" },
    body: { flex: 1, overflow: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" },
    card: { padding: "14px", borderRadius: "12px", background: "#fefcf9", border: "1px solid #f0ece6" },
    btn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "white", boxShadow: "0 2px 12px rgba(255,140,66,0.25)" },
    btnSecondary: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e7e5e4", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: "white", color: "#57534e" },
    spinner: { display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "jv-spin 0.8s linear infinite" },
  };

  return (
    <div style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>&diams;</div>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>
            <span style={{ color: "#ff8c42" }}>Job</span>Vest
          </span>
        </div>
        <button style={s.closeBtn} onClick={onClose}>&times;</button>
      </div>

      {/* Body */}
      <div style={s.body}>
        {/* NO_RESUME */}
        {state === STATES.NO_RESUME && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>&#128196;</p>
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>No Resume Found</p>
            <p style={{ fontSize: "12px", color: "#78716c", lineHeight: 1.6 }}>
              Open <a href="https://jobvest.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#ff8c42", textDecoration: "none", fontWeight: 600 }}>JobVest</a> and save your resume first, then sync it to this extension.
            </p>
          </div>
        )}

        {/* SCRAPING */}
        {state === STATES.SCRAPING && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={s.spinner} />
            <p style={{ fontSize: "13px", fontWeight: 600, marginTop: "16px" }}>Reading job description...</p>
          </div>
        )}

        {/* SCRAPE_FAIL */}
        {state === STATES.SCRAPE_FAIL && (
          <div>
            <div style={s.card}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#78716c", marginBottom: "8px" }}>
                {error ? `Error: ${error}` : "Couldn't auto-detect the job description"}
              </p>
              <p style={{ fontSize: "11px", color: "#a8a29e", marginBottom: "12px" }}>Paste it manually below:</p>
              <textarea
                value={manualJD}
                onChange={(e) => setManualJD(e.target.value)}
                placeholder="Paste the job description here..."
                style={{
                  width: "100%", minHeight: "120px", padding: "12px", borderRadius: "10px",
                  border: "1.5px dashed #d6d3d1", fontSize: "12px", lineHeight: 1.7,
                  fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none",
                  background: "#fefcf9",
                }}
              />
            </div>
            {manualJD.trim() && (
              <button style={{ ...s.btn, marginTop: "12px" }} onClick={handleManualScore}>
                &diams; Score My Match
              </button>
            )}
          </div>
        )}

        {/* SCORING */}
        {state === STATES.SCORING && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ ...s.logoIcon, width: "42px", height: "42px", fontSize: "18px", margin: "0 auto 16px", borderRadius: "12px" }}>&diams;</div>
            <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Scoring your resume...</p>
            <p style={{ fontSize: "11px", color: "#a8a29e" }}>Analyzing against job requirements</p>
          </div>
        )}

        {/* RESULT_LOW (< 50) */}
        {state === STATES.RESULT_LOW && (
          <div>
            {jobData?.title && (
              <div style={s.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dc2626" }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#dc2626", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Poor Match</span>
                </div>
                <p style={{ fontSize: "13px", fontWeight: 700 }}>{jobData.title}</p>
                {jobData.company && <p style={{ fontSize: "11px", color: "#78716c" }}>{jobData.company}{jobData.location ? ` \u00B7 ${jobData.location}` : ""}</p>}
              </div>
            )}

            <div style={{ padding: "14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px" }}>&#9888;&#65039;</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#dc2626" }}>Poor Match &mdash; {atsScore}%</span>
              </div>
              <div style={{ height: "6px", borderRadius: "3px", background: "#fee2e2", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ height: "100%", borderRadius: "3px", background: "#ef4444", width: `${atsScore}%`, transition: "width 0.5s" }} />
              </div>
              {mismatchReason && <p style={{ fontSize: "11px", color: "#991b1b", lineHeight: 1.6, marginBottom: "8px" }}>{mismatchReason}</p>}
              <p style={{ fontSize: "10px", color: "#ef4444", lineHeight: 1.6 }}>
                Tailoring won't bridge this gap. Revise your resume to better reflect this role.
              </p>
            </div>

            {atsFeedback && atsFeedback.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                {atsFeedback.map((item, i) => (
                  <FeedbackItem key={i} item={item} isOpen={expandedFeedback === i} onToggle={() => setExpandedFeedback(expandedFeedback === i ? null : i)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESULT_MID (50-84) */}
        {state === STATES.RESULT_MID && (
          <div>
            {jobData?.title && (
              <div style={s.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px rgba(22,163,106,0.4)" }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#16a34a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Job Detected</span>
                </div>
                <p style={{ fontSize: "13px", fontWeight: 700 }}>{jobData.title}</p>
                {jobData.company && <p style={{ fontSize: "11px", color: "#78716c" }}>{jobData.company}{jobData.location ? ` \u00B7 ${jobData.location}` : ""}</p>}
              </div>
            )}

            <ScoreGauge value={atsScore} type="ats" />

            {missedKeywords.length > 0 && (
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#78716c" }}>Missing Keywords</span>
                  <span style={{ fontSize: "9px", color: "#a8a29e", fontFamily: "monospace" }}>{missedKeywords.length} found</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {missedKeywords.map((kw) => (
                    <span key={kw} style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: 600, background: "#fff7ed", color: "#ea580c", border: "1px solid #fdba74" }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {atsFeedback && atsFeedback.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {atsFeedback.map((item, i) => (
                  <FeedbackItem key={i} item={item} isOpen={expandedFeedback === i} onToggle={() => setExpandedFeedback(expandedFeedback === i ? null : i)} />
                ))}
              </div>
            )}

            <div style={{ marginTop: "auto" }}>
              <button style={s.btn} onClick={handleTailor}>&diams; Tailor Resume for This Role</button>
              <p style={{ fontSize: "10px", color: "#a8a29e", textAlign: "center", marginTop: "8px" }}>Takes ~30s &middot; Downloads as text file</p>
            </div>
          </div>
        )}

        {/* RESULT_HIGH (85+) */}
        {state === STATES.RESULT_HIGH && (
          <div>
            {jobData?.title && (
              <div style={s.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px rgba(22,163,106,0.4)" }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#16a34a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Great Match</span>
                </div>
                <p style={{ fontSize: "13px", fontWeight: 700 }}>{jobData.title}</p>
                {jobData.company && <p style={{ fontSize: "11px", color: "#78716c" }}>{jobData.company}{jobData.location ? ` \u00B7 ${jobData.location}` : ""}</p>}
              </div>
            )}

            <ScoreGauge value={atsScore} type="ats" />

            <div style={{ padding: "14px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px" }}>&#10024;</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#15803d" }}>Perfect Fit &mdash; {atsScore}%</span>
              </div>
              <p style={{ fontSize: "11px", color: "#15803d", lineHeight: 1.6 }}>
                Your resume already covers the key requirements. No tailoring needed &mdash; go ahead and apply!
              </p>
            </div>

            <button
              style={{
                ...s.btn,
                background: markedApplied ? "#f0fdf4" : "#16a34a",
                color: markedApplied ? "#15803d" : "white",
                border: markedApplied ? "1.5px solid #bbf7d0" : "none",
                boxShadow: markedApplied ? "none" : "0 2px 12px rgba(22,163,74,0.2)",
                cursor: markedApplied ? "default" : "pointer",
              }}
              onClick={!markedApplied ? handleApplied : undefined}
              disabled={markedApplied}
            >
              {markedApplied ? "\u2713 Applied!" : "I applied for this job!"}
            </button>
          </div>
        )}

        {/* TAILORING */}
        {state === STATES.TAILORING && (
          <div style={{ textAlign: "center", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ ...s.logoIcon, width: "42px", height: "42px", fontSize: "18px", borderRadius: "12px", marginBottom: "16px" }}>&diams;</div>
            <p style={{ fontSize: "15px", fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: "3px" }}>Tailoring...</p>
            <p style={{ fontSize: "11px", color: "#a8a29e", marginBottom: "20px" }}>
              Optimizing ATS Score{jobData?.company ? ` \u00B7 ${jobData.company}` : ""}
            </p>
            <div style={{ width: "100%", height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #ff8c42, #ff6b35)", borderRadius: "4px", transition: "width 0.5s ease-out", width: `${tailor.progress}%` }} />
            </div>
            {tailorSteps.map((step, i) => {
              const done = tailor.progress >= thresholds[i];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", width: "100%" }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "4px", fontSize: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                    background: done ? "#f0fdf4" : "#f5f5f4",
                    color: done ? "#16a34a" : "#d6d3d1",
                  }}>
                    {done ? "\u2713" : i + 1}
                  </div>
                  <span style={{ fontSize: "10px", color: done ? "#57534e" : "#d6d3d1" }}>{step}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* TAILOR_DONE */}
        {state === STATES.TAILOR_DONE && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px", marginBottom: "14px",
              background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", color: "#16a34a",
            }}>
              &#10003;
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: "3px" }}>Resume Ready!</p>
            <p style={{ fontSize: "11px", color: "#78716c", marginBottom: "16px" }}>
              Tailored for {jobData?.company || "this role"}
            </p>

            <ATSResultCard before={atsScore} after={afterScore || atsScore} />

            <div style={{ width: "100%", margin: "6px 0 16px" }}>
              {["Bullets rewritten with role-specific metrics", "Missing keywords added naturally", "Summary tailored to JD", "Skills reordered"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "3px 0" }}>
                  <span style={{ color: "#16a34a", fontSize: "11px" }}>&#10003;</span>
                  <span style={{ fontSize: "10px", color: "#57534e" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
              <button style={s.btn} onClick={handleDownload}>&darr; Download Tailored Resume</button>
              <button
                style={{
                  ...s.btn,
                  background: markedApplied ? "#f0fdf4" : "#1a1a1a",
                  color: markedApplied ? "#15803d" : "white",
                  border: markedApplied ? "1.5px solid #bbf7d0" : "none",
                  boxShadow: markedApplied ? "none" : "0 2px 12px rgba(0,0,0,0.08)",
                }}
                onClick={!markedApplied ? handleApplied : undefined}
                disabled={markedApplied}
              >
                {markedApplied ? "\u2713 Applied!" : "I applied for this job!"}
              </button>
              <button style={{ ...s.btnSecondary, border: "none", color: "#a8a29e", fontSize: "11px" }} onClick={() => { onClose(); tailor.reset(); }}>
                &larr; Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes jv-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SidebarApp;
