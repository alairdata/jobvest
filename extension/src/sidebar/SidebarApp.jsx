import { useState, useEffect } from "react";
import { getATSMeta } from "../shared/scoring";
import { scoreResume, tailorResume } from "../shared/api";
import { getResume, saveResume, addApplication } from "../shared/storage";
import { scrapeJobDescription } from "../content/scrapers/index";
import { useTailor } from "./hooks/useTailor";
import { generateResumePdf } from "../shared/generatePdf";

const LOGO_SVG = (
  <svg width="18" height="22" viewBox="0 0 64 78" fill="none">
    <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#6fa8f7" strokeWidth="3.5" strokeLinejoin="round"/>
    <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#6fa8f7" opacity="0.85"/>
    <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#6fa8f7" opacity="0.85"/>
    <circle cx="32" cy="44" r="2.2" fill="#6fa8f7"/>
    <circle cx="32" cy="52" r="2.2" fill="#6fa8f7"/>
    <circle cx="32" cy="60" r="2.2" fill="#6fa8f7"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const STATES = {
  LOADING: "LOADING",
  NOT_SIGNED_IN: "NOT_SIGNED_IN",
  SIGNING_IN: "SIGNING_IN",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  NO_RESUME: "NO_RESUME",
  SCRAPING: "SCRAPING",
  SCRAPE_FAIL: "SCRAPE_FAIL",
  SCORING: "SCORING",
  RESULT: "RESULT",
  TAILORING: "TAILORING",
  TAILOR_DONE: "TAILOR_DONE",
};

const tailorSteps = ["Reading JD", "Extracting keywords", "Matching skills", "Rewriting bullets", "Optimizing", "ATS check", "Finalizing"];
const thresholds = [14, 32, 50, 68, 82, 95, 100];

const SidebarApp = ({ onClose }) => {
  const [state, setState] = useState(STATES.LOADING);
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [manualJD, setManualJD] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [mismatchReason, setMismatchReason] = useState(null);
  const [missedKeywords, setMissedKeywords] = useState([]);
  const [afterScore, setAfterScore] = useState(null);
  const [tailoredData, setTailoredData] = useState(null);
  const [markedApplied, setMarkedApplied] = useState(false);
  const [error, setError] = useState(null);

  // Sign-in form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const tailor = useTailor();

  // On mount: check auth -> fetch resume -> scrape
  useEffect(() => {
    (async () => {
      const sessionResult = await chrome.runtime.sendMessage({ type: "RESTORE_SESSION" });

      if (!sessionResult || sessionResult.error || !sessionResult.user) {
        setState(STATES.NOT_SIGNED_IN);
        return;
      }

      setUser(sessionResult.user);
      await afterSignIn(sessionResult.session, sessionResult.user);
    })();
  }, []);

  const afterSignIn = async (session, signedInUser) => {
    // Fetch resume from Supabase
    const resumeResult = await chrome.runtime.sendMessage({
      type: "FETCH_RESUME",
      accessToken: session.access_token,
      userId: signedInUser.id,
    });

    if (!resumeResult || resumeResult.error || !resumeResult.resume) {
      setState(STATES.NO_RESUME);
      return;
    }

    await saveResume(resumeResult.resume);
    setResume(resumeResult.resume);

    // Scrape job page
    const scraped = scrapeJobDescription();
    if (scraped.success) {
      setJobData(scraped);
      doScore(resumeResult.resume.resumeText, scraped.description, scraped);
    } else {
      setState(STATES.SCRAPE_FAIL);
    }
  };

  const handleSignInGoogle = async () => {
    setState(STATES.SIGNING_IN);
    setError(null);

    const result = await chrome.runtime.sendMessage({ type: "SIGN_IN_GOOGLE" });

    if (result.error) {
      setError(result.error);
      setState(STATES.NOT_SIGNED_IN);
      return;
    }

    setUser(result.user);
    await afterSignIn(result.session, result.user);
  };

  const handleSignInEmail = async () => {
    if (!email.trim() || !password.trim()) return;
    setState(STATES.SIGNING_IN);
    setError(null);

    const result = await chrome.runtime.sendMessage({
      type: "SIGN_IN_EMAIL",
      email: email.trim(),
      password,
    });

    if (result.error) {
      setError(result.error);
      setState(STATES.NOT_SIGNED_IN);
      return;
    }

    setUser(result.user);
    await afterSignIn(result.session, result.user);
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) return;
    setError(null);

    const result = await chrome.runtime.sendMessage({
      type: "RESET_PASSWORD",
      email: resetEmail.trim(),
    });

    if (result.error) {
      setError(result.error);
    } else {
      setResetSent(true);
    }
  };

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

      // Estimate after-tailoring score
      if (data.score < 85) {
        setAfterScore(Math.min(data.score + 18, 92));
      }

      setState(STATES.RESULT);
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
      const tailored = await tailorResume(resume.resumeText, jdText);
      if (tailored.error) throw new Error(tailored.error);
      setTailoredData(tailored);

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
      setState(STATES.RESULT);
      tailor.reset();
    }
  };

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
    const pdfUrl = generateResumePdf(tailoredData);
    const a = document.createElement("a");
    a.href = pdfUrl;
    const safeName = (tailoredData.name || "Resume").replace(/[^a-zA-Z\s]/g, "").trim().replace(/\s+/g, "_");
    const safeTitle = (jobData?.title || "Role").replace(/[^a-zA-Z\s]/g, "").trim().replace(/\s+/g, "_");
    a.download = `${safeName}_${safeTitle}.pdf`;
    a.click();
    URL.revokeObjectURL(pdfUrl);
  };

  // --- Styles ---
  const s = {
    panel: { width: "380px", height: "100vh", position: "fixed", top: 0, right: 0, background: "#fff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "14px", color: "#1a1a1a", zIndex: 2147483647, boxShadow: "-4px 0 24px rgba(0,0,0,0.06)" },
    header: { padding: "14px 18px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: "8px" },
    closeBtn: { background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px", padding: "4px" },
    body: { flex: 1, overflow: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" },
    card: { padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" },
    btn: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "white", boxShadow: "0 2px 12px rgba(59,130,246,0.25)" },
    btnSecondary: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', system-ui, sans-serif", background: "white", color: "#64748b" },
    input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "13px", fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", background: "#f8fafc", color: "#0f172a", transition: "border-color 0.2s" },
    spinner: { display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(59,130,246,0.2)", borderTop: "2px solid #3b82f6", borderRadius: "50%", animation: "jv-spin 0.8s linear infinite" },
  };

  return (
    <div style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          {LOGO_SVG}
          <span style={{ fontSize: "14px", fontWeight: 700 }}>
            <span style={{ color: "#93c5fd" }}>Job</span><span style={{ color: "#3b82f6" }}>Vest</span>
          </span>
        </div>
        <button style={s.closeBtn} onClick={onClose}>&times;</button>
      </div>

      {/* Body */}
      <div style={s.body}>
        {/* LOADING */}
        {state === STATES.LOADING && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={s.spinner} />
            <p style={{ fontSize: "13px", fontWeight: 600, marginTop: "16px", color: "#64748b" }}>Loading...</p>
          </div>
        )}

        {/* NOT_SIGNED_IN */}
        {state === STATES.NOT_SIGNED_IN && (
          <div style={{ padding: "24px 8px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", margin: "0 auto 16px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="26" height="32" viewBox="0 0 64 78" fill="none">
                  <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round"/>
                  <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#fff" opacity="0.9"/>
                  <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#fff" opacity="0.9"/>
                  <circle cx="32" cy="44" r="2.2" fill="#fff"/>
                  <circle cx="32" cy="52" r="2.2" fill="#fff"/>
                  <circle cx="32" cy="60" r="2.2" fill="#fff"/>
                </svg>
              </div>
              <p style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Welcome to JobVest</p>
              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                Sign in to access your resume and tailor it for this job.
              </p>
            </div>

            {/* Email / Password form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignInEmail()}
                style={s.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignInEmail()}
                style={s.input}
              />
              <div style={{ textAlign: "right" }}>
                <span
                  onClick={() => { setState(STATES.FORGOT_PASSWORD); setError(null); setResetSent(false); setResetEmail(email); }}
                  style={{ fontSize: "11px", color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}
                >
                  Forgot password?
                </span>
              </div>
              <button style={s.btn} onClick={handleSignInEmail}>
                Sign In
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>

            {/* Google sign-in */}
            <button
              style={{
                ...s.btn, marginTop: "6px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                background: "#fff", color: "#1e293b", border: "1.5px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onClick={handleSignInGoogle}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {error && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "12px", textAlign: "center" }}>{error}</p>
            )}

            <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "20px", lineHeight: 1.5, textAlign: "center" }}>
              Your resume data syncs from your{" "}
              <a href="https://jobvest.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>JobVest</a>
              {" "}account.
            </p>
          </div>
        )}

        {/* FORGOT_PASSWORD */}
        {state === STATES.FORGOT_PASSWORD && (
          <div style={{ padding: "24px 8px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Reset Password</p>
              <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
                {resetSent ? "Check your email for the reset link." : "Enter your email to receive a reset link."}
              </p>
            </div>

            {!resetSent && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  style={s.input}
                />
                <button style={s.btn} onClick={handleResetPassword}>
                  Send Reset Link
                </button>
              </div>
            )}

            {error && (
              <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "12px", textAlign: "center" }}>{error}</p>
            )}

            <button
              style={{ ...s.btnSecondary, marginTop: "14px", border: "none", color: "#3b82f6" }}
              onClick={() => { setState(STATES.NOT_SIGNED_IN); setError(null); }}
            >
              &larr; Back to Sign In
            </button>
          </div>
        )}

        {/* SIGNING_IN */}
        {state === STATES.SIGNING_IN && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={s.spinner} />
            <p style={{ fontSize: "13px", fontWeight: 600, marginTop: "16px", color: "#64748b" }}>Signing in...</p>
          </div>
        )}

        {/* NO_RESUME */}
        {state === STATES.NO_RESUME && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "40px", marginBottom: "16px" }}>&#128196;</p>
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>No Resume Found</p>
            <p style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6 }}>
              Upload and save your resume at{" "}
              <a href="https://jobvest.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 600 }}>jobvest.vercel.app</a>
              {" "}first, then reopen this panel.
            </p>
          </div>
        )}

        {/* SCRAPE_FAIL */}
        {state === STATES.SCRAPE_FAIL && (
          <div>
            {/* Resume card still shows */}
            {resume && (
              <div style={{ ...s.card, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="18" viewBox="0 0 16 20" fill="none"><path d="M10 1H3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6l-5-5z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1v5h5M8 10H5M11 14H5M7 7H5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Master Resume</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8" }}>{resume.resumeFileName || "resume.pdf"}</p>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
              </div>
            )}
            <div style={s.card}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "8px" }}>
                {error ? `Error: ${error}` : "Couldn't auto-detect the job description"}
              </p>
              <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "12px" }}>Paste it manually below:</p>
              <textarea
                value={manualJD}
                onChange={(e) => setManualJD(e.target.value)}
                placeholder="Paste the job description here..."
                style={{
                  width: "100%", minHeight: "120px", padding: "12px", borderRadius: "10px",
                  border: "1.5px dashed #cbd5e1", fontSize: "12px", lineHeight: 1.7,
                  fontFamily: "'DM Sans', system-ui, sans-serif", resize: "vertical", outline: "none",
                  background: "#f8fafc",
                }}
              />
            </div>
            {manualJD.trim() && (
              <button style={{ ...s.btn, marginTop: "12px" }} onClick={handleManualScore}>
                Score My Match
              </button>
            )}
          </div>
        )}

        {/* SCORING */}
        {state === STATES.SCORING && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="20" height="24" viewBox="0 0 64 78" fill="none">
                <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#fff" opacity="0.9"/>
                <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#fff" opacity="0.9"/>
                <circle cx="32" cy="46" r="2.5" fill="#fff"/>
                <circle cx="32" cy="55" r="2.5" fill="#fff"/>
              </svg>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Scoring your resume...</p>
            <p style={{ fontSize: "11px", color: "#94a3b8" }}>Analyzing against job requirements</p>
          </div>
        )}

        {/* RESULT — matches the screenshot layout */}
        {state === STATES.RESULT && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Job Detected card */}
            {jobData?.title && (
              <div style={s.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: atsScore < 50 ? "#dc2626" : "#16a34a", boxShadow: atsScore >= 50 ? "0 0 6px rgba(22,163,106,0.4)" : "none" }} />
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: atsScore < 50 ? "#dc2626" : "#16a34a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {atsScore >= 85 ? "Great Match" : atsScore >= 50 ? "Job Detected" : "Poor Match"}
                  </span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{jobData.title}</p>
                {jobData.company && <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{jobData.company}{jobData.location ? ` \u00B7 ${jobData.location}` : ""}</p>}
              </div>
            )}

            {/* Extracted Keywords */}
            {missedKeywords.length > 0 && (
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Extracted Keywords</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "monospace" }}>{missedKeywords.length} found</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {missedKeywords.map((kw) => (
                    <span key={kw} style={{ padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: 600, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Master Resume card */}
            {resume && (
              <div style={{ ...s.card, display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="20" viewBox="0 0 16 20" fill="none"><path d="M10 1H3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6l-5-5z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1v5h5M8 10H5M11 14H5M7 7H5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Master Resume</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume.resumeFileName || "resume.pdf"}</p>
                </div>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              </div>
            )}

            {/* ATS Score card */}
            <div style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="16" viewBox="0 0 64 78" fill="none">
                    <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>ATS Score for this job</span>
              </div>

              {/* Current score */}
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Current</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: atsScore >= 85 ? "#16a34a" : atsScore >= 50 ? "#ea580c" : "#dc2626" }}>{atsScore}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "3px", background: atsScore >= 85 ? "#22c55e" : atsScore >= 50 ? "#f97316" : "#ef4444", width: `${atsScore}%`, transition: "width 0.8s ease-out" }} />
                </div>
              </div>

              {/* After tailoring estimate */}
              {atsScore < 85 && afterScore && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>After tailoring</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#3b82f6" }}>~{afterScore}%</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, #3b82f6, #1d4ed8)", width: `${afterScore}%`, transition: "width 0.8s ease-out" }} />
                  </div>
                </div>
              )}

              <p style={{ fontSize: "10px", color: "#94a3b8", lineHeight: 1.5 }}>
                {atsScore >= 85
                  ? "Your resume already covers the key requirements. Go ahead and apply!"
                  : "Safe zone: 80-85% \u00B7 Above 95% risks looking like spam"}
              </p>
            </div>

            {/* Mismatch reason for low scores */}
            {atsScore < 50 && mismatchReason && (
              <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                <p style={{ fontSize: "11px", color: "#991b1b", lineHeight: 1.6 }}>{mismatchReason}</p>
              </div>
            )}

            {/* Action button */}
            {atsScore >= 85 ? (
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
            ) : atsScore >= 50 ? (
              <div>
                <button style={s.btn} onClick={handleTailor}>
                  &#10024; Tailor Resume for This Role
                </button>
                <p style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", marginTop: "6px" }}>Takes ~30s</p>
              </div>
            ) : (
              <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                <p style={{ fontSize: "10px", color: "#ef4444", lineHeight: 1.6 }}>
                  Tailoring won't bridge this gap. Revise your resume to better reflect this role.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAILORING */}
        {state === STATES.TAILORING && (
          <div style={{ textAlign: "center", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <svg width="20" height="24" viewBox="0 0 64 78" fill="none">
                <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#fff" opacity="0.9"/>
                <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#fff" opacity="0.9"/>
                <circle cx="32" cy="46" r="2.5" fill="#fff"/>
                <circle cx="32" cy="55" r="2.5" fill="#fff"/>
              </svg>
            </div>
            <p style={{ fontSize: "15px", fontWeight: 700, marginBottom: "3px" }}>Tailoring...</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "20px" }}>
              Optimizing ATS Score{jobData?.company ? ` \u00B7 ${jobData.company}` : ""}
            </p>
            <div style={{ width: "100%", height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #1d4ed8)", borderRadius: "4px", transition: "width 0.5s ease-out", width: `${tailor.progress}%` }} />
            </div>
            {tailorSteps.map((step, i) => {
              const done = tailor.progress >= thresholds[i];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", width: "100%" }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "4px", fontSize: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                    background: done ? "#f0fdf4" : "#f1f5f9",
                    color: done ? "#16a34a" : "#cbd5e1",
                  }}>
                    {done ? "\u2713" : i + 1}
                  </div>
                  <span style={{ fontSize: "10px", color: done ? "#334155" : "#cbd5e1" }}>{step}</span>
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
            <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "3px" }}>Resume Ready!</p>
            <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "16px" }}>
              Tailored for {jobData?.company || "this role"}
            </p>

            {/* Before / After ATS score */}
            <div style={{ ...s.card, width: "100%", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="16" viewBox="0 0 64 78" fill="none"><path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>ATS Score</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Before</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#f97316" }}>{atsScore}%</span>
                </div>
                <div style={{ height: "5px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "3px", background: "#f97316", width: `${atsScore}%` }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>After</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>{afterScore || atsScore}%</span>
                </div>
                <div style={{ height: "5px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "3px", background: "#22c55e", width: `${afterScore || atsScore}%` }} />
                </div>
              </div>
            </div>

            <div style={{ width: "100%", margin: "6px 0 16px" }}>
              {["Bullets rewritten with role-specific metrics", "Missing keywords added naturally", "Summary tailored to JD", "Skills reordered"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "3px 0" }}>
                  <span style={{ color: "#16a34a", fontSize: "11px" }}>&#10003;</span>
                  <span style={{ fontSize: "10px", color: "#334155" }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
              <button style={s.btn} onClick={handleDownload}>&darr; Download Tailored Resume</button>
              <button
                style={{
                  ...s.btn,
                  background: markedApplied ? "#f0fdf4" : "#0f172a",
                  color: markedApplied ? "#15803d" : "white",
                  border: markedApplied ? "1.5px solid #bbf7d0" : "none",
                  boxShadow: markedApplied ? "none" : "0 2px 12px rgba(0,0,0,0.08)",
                }}
                onClick={!markedApplied ? handleApplied : undefined}
                disabled={markedApplied}
              >
                {markedApplied ? "\u2713 Applied!" : "I applied for this job!"}
              </button>
              <button style={{ ...s.btnSecondary, border: "none", color: "#94a3b8", fontSize: "11px" }} onClick={() => { onClose(); tailor.reset(); }}>
                &larr; Back
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes jv-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SidebarApp;
