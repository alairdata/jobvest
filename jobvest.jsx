import { useState } from "react";

const JobVest = () => {
  const [mode, setMode] = useState("fix");
  const [tab, setTab] = useState("home");
  const [hasResume, setHasResume] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [tailorDone, setTailorDone] = useState(false);
  const [tailorProgress, setTailorProgress] = useState(0);
  const [quickTailorJD, setQuickTailorJD] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [quickTailoring, setQuickTailoring] = useState(false);
  const [quickTailorDone, setQuickTailorDone] = useState(false);
  const [quickTailorProgress, setQuickTailorProgress] = useState(0);

  const runTailor = (setP, setD, setIng) => {
    setP(0); setD(false); setIng(true);
    const steps = [{ p: 14, t: 400 }, { p: 32, t: 600 }, { p: 50, t: 500 }, { p: 68, t: 700 }, { p: 82, t: 500 }, { p: 95, t: 500 }, { p: 100, t: 300 }];
    let i = 0;
    const run = () => {
      if (i < steps.length) { setTimeout(() => { setP(steps[i].p); i++; run(); }, steps[i].t); }
      else { setTimeout(() => { setD(true); setIng(false); }, 400); }
    };
    run();
  };

  const fixStrength = 58;
  const launchStrength = 84;

  // Resume Strength: human-focused
  const getStrengthMeta = (v) => {
    if (v >= 80) return { color: "#16a34a", label: "STRONG", sub: "Ideal zone (80-90%)" };
    if (v >= 70) return { color: "#2563eb", label: "PASS", sub: "Minimum pass — aim for 80%+" };
    if (v >= 60) return { color: "#d97706", label: "NEEDS WORK", sub: "Below pass mark (70%)" };
    return { color: "#dc2626", label: "TOO VAGUE", sub: "Major improvements needed" };
  };

  // ATS Score: machine-focused, per job
  const getATSMeta = (v) => {
    if (v >= 95) return { color: "#dc2626", label: "SPAM RISK", sub: "May look like keyword stuffing to recruiters" };
    if (v >= 80) return { color: "#16a34a", label: "IDEAL", sub: "Safe zone (80-85%)" };
    if (v >= 75) return { color: "#2563eb", label: "PASS", sub: "Minimum pass — tailoring can improve" };
    return { color: "#dc2626", label: "LOW", sub: "Likely filtered out by ATS" };
  };

  const applications = [
    { role: "Data Scientist", company: "Safaricom PLC", status: "applied", date: "Feb 27", ats: 83, platform: "LinkedIn" },
    { role: "ML Engineer", company: "MTN Ghana", status: "interview", date: "Feb 24", ats: 82, platform: "Indeed" },
    { role: "AI Research Analyst", company: "Google DeepMind", status: "applied", date: "Feb 22", ats: 79, platform: "Careers" },
    { role: "Data Analyst", company: "Hubtel", status: "rejected", date: "Feb 18", ats: 72, platform: "LinkedIn" },
    { role: "Data Scientist II", company: "Flutterwave", status: "pending", date: "Feb 15", ats: 81, platform: "Wellfound" },
    { role: "Analytics Engineer", company: "Andela", status: "applied", date: "Feb 12", ats: 84, platform: "LinkedIn" },
  ];

  const [openMenu, setOpenMenu] = useState(null);

  const allStatuses = [
    { key: "applied", bg: "#eff6ff", text: "#2563eb", label: "Applied" },
    { key: "interview", bg: "#ecfdf5", text: "#16a34a", label: "Interview" },
    { key: "offered", bg: "#f0fdf4", text: "#15803d", label: "Offered" },
    { key: "accepted", bg: "#dcfce7", text: "#166534", label: "Accepted" },
    { key: "rejected", bg: "#fef2f2", text: "#dc2626", label: "Rejected" },
    { key: "withdrawn", bg: "#f5f5f4", text: "#78716c", label: "Withdrawn" },
    { key: "pending", bg: "#fffbeb", text: "#d97706", label: "Pending" },
  ];

  const statusMap = {};
  allStatuses.forEach(s => { statusMap[s.key] = { bg: s.bg, text: s.text, label: s.label }; });

  const [appStatuses, setAppStatuses] = useState(
    applications.map(a => a.status)
  );

  const updateStatus = (idx, newStatus) => {
    setAppStatuses(prev => { const n = [...prev]; n[idx] = newStatus; return n; });
    setOpenMenu(null);
  };

  const LogView = () => (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Application Log</h2>
      <p style={{ fontSize: "13px", color: "#78716c", margin: "0 0 24px" }}>Track where you've applied and how your tailored resumes scored.</p>

      {/* Funnel */}
      {(() => {
        const total = applications.length;
        const stages = [
          { label: "Applied", count: appStatuses.filter(s => ["applied", "interview", "offered", "accepted", "pending"].includes(s)).length, color: "#60a5fa" },
          { label: "Screening", count: appStatuses.filter(s => ["interview", "offered", "accepted", "pending"].includes(s)).length, color: "#3b82f6" },
          { label: "Interview", count: appStatuses.filter(s => ["interview", "offered", "accepted"].includes(s)).length, color: "#2563eb" },
          { label: "Offered", count: appStatuses.filter(s => ["offered", "accepted"].includes(s)).length, color: "#1e40af" },
          { label: "Accepted", count: appStatuses.filter(s => s === "accepted").length, color: "#1e3a5f" },
        ];
        const max = Math.max(stages[0].count, 1);
        return (
          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #f0ece6", padding: "24px", marginBottom: "20px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>Your Pipeline</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {stages.map((stage, i) => {
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                const barWidth = Math.max((stage.count / max) * 100, 12);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#78716c", width: "76px", textAlign: "right", paddingRight: "14px", flexShrink: 0 }}>{stage.label}</span>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <div style={{
                        width: `${barWidth}%`, height: "36px", borderRadius: "6px",
                        background: stage.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                        opacity: stage.count === 0 ? 0.2 : 1,
                        minWidth: "40px",
                      }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{stage.count}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#a8a29e", width: "52px", paddingLeft: "14px", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #f0ece6", overflow: "visible" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 1fr 40px", padding: "10px 20px", borderBottom: "1px solid #f5f0eb", background: "#fefcf9", borderRadius: "14px 14px 0 0" }}>
          {["Role", "Platform", "ATS Score", "Date", "Status", ""].map(h => (
            <span key={h} style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{h}</span>
          ))}
        </div>
        {applications.map((app, i) => {
          const currentStatus = appStatuses[i];
          const st = statusMap[currentStatus];
          const am = getATSMeta(app.ats);
          const menuOpen = openMenu === i;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 1fr 40px",
              padding: "14px 20px", borderBottom: i < applications.length - 1 ? "1px solid #faf8f5" : "none",
              transition: "background 0.15s", position: "relative",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fefcf9"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>{app.role}</p>
                <p style={{ fontSize: "10px", color: "#a8a29e", margin: "2px 0 0" }}>{app.company}</p>
              </div>
              <span style={{ fontSize: "11px", color: "#78716c", alignSelf: "center" }}>{app.platform}</span>
              <div style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "36px", height: "3px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${app.ats}%`, background: am.color, borderRadius: "3px" }} />
                </div>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: am.color, fontWeight: 600 }}>{app.ats}</span>
              </div>
              <span style={{ fontSize: "11px", color: "#a8a29e", alignSelf: "center", fontFamily: "'JetBrains Mono', monospace" }}>{app.date}</span>
              <span style={{ padding: "3px 10px", borderRadius: "16px", fontSize: "10px", fontWeight: 600, background: st.bg, color: st.text, alignSelf: "center", justifySelf: "start" }}>{st.label}</span>

              {/* Three dot menu */}
              <div style={{ alignSelf: "center", justifySelf: "center", position: "relative" }}>
                <button onClick={(e) => { e.stopPropagation(); setOpenMenu(menuOpen ? null : i); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "16px", color: "#a8a29e", padding: "4px 6px", borderRadius: "6px",
                  lineHeight: 1, transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f4"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >⋮</button>

                {menuOpen && (
                  <>
                    <div onClick={() => setOpenMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 60 }} />
                    <div style={{
                      position: "absolute", right: 0, top: "100%", marginTop: "4px", zIndex: 70,
                      background: "#fff", borderRadius: "12px", border: "1px solid #f0ece6",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
                      padding: "6px", minWidth: "150px",
                    }}>
                      <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", padding: "6px 10px 4px", margin: 0, letterSpacing: "0.5px", textTransform: "uppercase" }}>Update status</p>
                      {allStatuses.map(s => (
                        <button key={s.key} onClick={(e) => { e.stopPropagation(); updateStatus(i, s.key); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px", width: "100%",
                            padding: "8px 10px", border: "none", borderRadius: "8px", cursor: "pointer",
                            background: currentStatus === s.key ? s.bg : "transparent",
                            transition: "background 0.1s", textAlign: "left",
                          }}
                          onMouseEnter={e => { if (currentStatus !== s.key) e.currentTarget.style.background = "#fafaf8"; }}
                          onMouseLeave={e => { if (currentStatus !== s.key) e.currentTarget.style.background = "transparent"; }}
                        >
                          <span style={{
                            width: "8px", height: "8px", borderRadius: "50%", background: s.text, flexShrink: 0,
                          }} />
                          <span style={{ fontSize: "12px", fontWeight: currentStatus === s.key ? 700 : 500, color: "#1a1a1a" }}>{s.label}</span>
                          {currentStatus === s.key && <span style={{ marginLeft: "auto", fontSize: "11px", color: s.text }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );  const fixFeedback = [
    { section: "Contact Information", status: "good", msg: "All fields present and parseable", details: "Your name, email, phone, and LinkedIn are clearly formatted. No changes needed." },
    { section: "Professional Summary", status: "warning", msg: "Too generic — needs role-specific language", details: "Add specific terms like 'predictive modeling,' 'cross-functional analytics,' or 'stakeholder reporting' to mirror what hiring managers look for." },
    { section: "Skills", status: "warning", msg: "Missing trending tools, consider grouping", details: "Add high-demand tools like TensorFlow, AWS, and GCP. Group skills into categories (Languages, Frameworks, Tools) for better readability." },
    { section: "Work History", status: "error", msg: "Most bullets lack quantified achievements", details: "Use the X-Y-Z formula: 'Accomplished [X] as measured by [Y] by doing [Z].' Example: 'Reduced report time by 60% by building automated Python pipelines serving 5 departments.'" },
    { section: "Education", status: "error", msg: "Relevant coursework or GPA missing", details: "Add relevant coursework (Machine Learning, Statistical Modeling) and GPA if 3.5+ to strengthen your candidacy." },
  ];

  const launchFeedback = [
    { section: "Contact Information", status: "good", msg: "Clean and ATS-ready", details: "Everything looks perfect." },
    { section: "Professional Summary", status: "good", msg: "Strong role-specific keywords", details: "Your summary includes targeted keywords aligned with data science and ML roles." },
    { section: "Skills", status: "good", msg: "Well-organized with trending tools", details: "Skills are grouped by category and include high-demand tools. Great structure." },
    { section: "Work History", status: "good", msg: "Quantified achievements throughout", details: "Your bullets follow the X-Y-Z formula with clear metrics. Excellent work." },
    { section: "Education", status: "warning", msg: "Add 1-2 relevant courses for keyword boost", details: "Listing courses like 'Advanced ML' or 'Graph Neural Networks' could help with research-heavy roles." },
  ];

  const sIcon = (s) => {
    if (s === "good") return { bg: "#ecfdf5", border: "#bbf7d0", color: "#16a34a", icon: "✓" };
    if (s === "warning") return { bg: "#fffbeb", border: "#fde68a", color: "#d97706", icon: "!" };
    return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: "✕" };
  };

  // Rounded gauge
  const ScoreGauge = ({ value, sz = 200, type = "strength" }) => {
    const meta = type === "strength" ? getStrengthMeta(value) : getATSMeta(value);
    const r = 80;
    const circ = Math.PI * r;
    const off = circ - (value / 100) * circ;
    const cx = sz / 2;
    const baseline = r + 16;
    const svgH = baseline + 8;
    return (
      <div style={{ margin: "12px auto 4px", textAlign: "center" }}>
        <svg width={sz} height={svgH} viewBox={`0 0 ${sz} ${svgH}`} style={{ display: "block", margin: "0 auto" }}>
          <path d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
            fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
          <path d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
            fill="none" stroke={meta.color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 2px 8px ${meta.color}44)` }} />
        </svg>
        <div style={{ marginTop: "-56px", paddingBottom: "8px" }}>
          <span style={{ fontSize: "48px", fontWeight: 800, fontFamily: "'Source Serif 4', serif", color: meta.color, lineHeight: 1 }}>{value}</span>
          <p style={{ fontSize: "11px", fontWeight: 700, color: meta.color, margin: "4px 0 0", letterSpacing: "1.5px", fontFamily: "'JetBrains Mono', monospace" }}>{meta.label}</p>
        </div>
      </div>
    );
  };

  // Score type badge
  const ScoreTypeBadge = ({ type }) => {
    const isStrength = type === "strength";
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 600,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.3px",
        background: isStrength ? "#fef3c7" : "#dbeafe",
        color: isStrength ? "#92400e" : "#1e40af",
        border: `1px solid ${isStrength ? "#fde68a" : "#bfdbfe"}`,
      }}>
        <span>{isStrength ? "👤" : "🤖"}</span>
        {isStrength ? "HUMAN-FOCUSED" : "MACHINE-FOCUSED"}
      </div>
    );
  };

  // ATS result with spam warning
  const ATSResultCard = ({ before, after }) => {
    const metaBefore = getATSMeta(before);
    const metaAfter = getATSMeta(after);
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "18px", borderRadius: "12px", background: metaAfter.color === "#dc2626" ? "#fef2f2" : "#ecfdf5", border: `1px solid ${metaAfter.color === "#dc2626" ? "#fecaca" : "#bbf7d0"}`, marginBottom: "10px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "9px", color: "#78716c", margin: "0 0 2px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Before</p>
            <span style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: metaBefore.color }}>{before}%</span>
            <p style={{ fontSize: "9px", color: metaBefore.color, margin: "2px 0 0", fontWeight: 600 }}>{metaBefore.label}</p>
          </div>
          <span style={{ fontSize: "20px", color: metaAfter.color, alignSelf: "center" }}>→</span>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "9px", color: "#78716c", margin: "0 0 2px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>After</p>
            <span style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: metaAfter.color }}>{after}%</span>
            <p style={{ fontSize: "9px", color: metaAfter.color, margin: "2px 0 0", fontWeight: 600 }}>{metaAfter.label}</p>
          </div>
        </div>
        {after >= 95 && (
          <div style={{ padding: "10px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca", display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: "10px", color: "#991b1b", margin: 0, lineHeight: 1.5 }}>
              <strong>Spam risk:</strong> ATS scores above 95% can look like keyword stuffing to recruiters. We've kept it in the 80-85% safe zone for natural readability.
            </p>
          </div>
        )}
        <p style={{ fontSize: "9px", color: "#a8a29e", margin: "0 0 6px", textAlign: "center" }}>
          🤖 ATS Score measures keyword match against this specific job description
        </p>
      </div>
    );
  };

  // Feedback item with dropdown
  const FeedbackItem = ({ item, idx }) => {
    const st = sIcon(item.status);
    const isOpen = expandedFeedback === idx;
    return (
      <div style={{ borderRadius: "10px", border: `1px solid ${st.border}`, overflow: "hidden" }}>
        <div onClick={() => setExpandedFeedback(isOpen ? null : idx)} style={{
          display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: st.bg, cursor: "pointer",
        }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff", border: `2px solid ${st.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800, color: st.color, flexShrink: 0 }}>{st.icon}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", fontWeight: 600, margin: 0, color: "#1a1a1a" }}>{item.section}</p>
            <p style={{ fontSize: "10px", color: "#78716c", margin: "1px 0 0" }}>{item.msg}</p>
          </div>
          <span style={{ color: "#a8a29e", fontSize: "14px", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
        </div>
        {isOpen && (
          <div style={{ padding: "12px 14px 14px 46px", background: "#fff", borderTop: `1px solid ${st.border}` }}>
            <p style={{ fontSize: "11px", color: "#57534e", lineHeight: 1.7, margin: 0 }}>{item.details}</p>
          </div>
        )}
      </div>
    );
  };

  // ─── HEADER ───
  const Header = () => (
    <header style={{ padding: "14px 28px", background: "#fff", borderBottom: "1px solid #f0ece6", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: 700, boxShadow: "0 2px 8px rgba(255,140,66,0.25)" }}>✧</div>
        <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.4px" }}><span style={{ color: "#ff8c42" }}>Job</span><span style={{ color: "#1a1a1a" }}>Vest</span></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {[{ id: "home", label: "Get Started" }, { id: "log", label: "Application Log" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: tab === t.id ? "#fff7ed" : "transparent", color: tab === t.id ? "#ea580c" : "#94a3b8" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {hasResume && <button onClick={() => { setMode(mode === "fix" ? "launch" : "fix"); setTab("home"); setQuickTailorDone(false); setQuickTailoring(false); setQuickTailorJD(false); setExpandedFeedback(null); }} style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #e7e5e4", background: "#fefcf9", color: "#78716c", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>Demo: {mode === "fix" ? `Strength ${fixStrength}` : `Strength ${launchStrength}`} → Switch</button>}
        <button onClick={() => { setSidebarOpen(true); setTailorDone(false); setTailoring(false); setTailorProgress(0); }} style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 10px rgba(255,140,66,0.25)", display: "flex", alignItems: "center", gap: "6px" }}>◎ Sidebar</button>
      </div>
    </header>
  );

  // ─── ONBOARDING ───
  const OnboardingView = () => (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ width: "200px", height: "80px", margin: "-30px auto 0", background: "radial-gradient(ellipse, rgba(255,200,120,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
      <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "34px", fontWeight: 800, margin: "0 0 40px", color: "#1a1a1a" }}>Here's how it works</h1>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", marginBottom: "48px", flexWrap: "wrap" }}>
        {[
          { icon: "📄", bg: "#eff6ff", title: "Step 1", desc: "Import your resume" },
          { icon: "✏️", bg: "#ede9fe", title: "Step 2", desc: "Get your Resume Strength Score and feedback on what to improve" },
          { icon: "🚀", bg: "#fff7ed", title: "Step 3", desc: "Launch your job search with ATS-optimized, tailored resumes" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 200px", textAlign: "center", padding: "0 12px" }}>
              <div style={{ width: "72px", height: "72px", margin: "0 auto 16px", background: s.bg, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>{s.icon}</div>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "18px", fontWeight: 800, margin: "0 0 6px" }}>{s.title}</p>
              <p style={{ fontSize: "13px", color: "#78716c", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
            {i < 2 && <div style={{ flex: "0 0 60px", display: "flex", alignItems: "center", height: "72px" }}><div style={{ width: "100%", borderTop: "2.5px dashed #d6d3d1" }} /></div>}
          </div>
        ))}
      </div>
      <button onClick={() => setHasResume(true)} style={{ padding: "18px 48px", borderRadius: "40px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", boxShadow: "0 4px 20px rgba(255,140,66,0.3), 0 2px 8px rgba(0,0,0,0.08)" }}>Import my resume</button>
      <p style={{ fontSize: "12px", color: "#a8a29e", margin: "14px 0 0" }}>By clicking above, you agree to our <span style={{ color: "#2563eb", cursor: "pointer" }}>Terms of Use</span> and <span style={{ color: "#2563eb", cursor: "pointer" }}>Privacy Policy</span>.</p>
    </div>
  );

  // ─── FIX VIEW ───
  const FixView = () => {
    const meta = getStrengthMeta(fixStrength);
    return (
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "28px", fontWeight: 800, margin: "0 0 6px", color: "#1a1a1a" }}>
            Great job! Let's take a closer look <span style={{ color: "#ff8c42" }}>✦</span>
          </h1>
          <p style={{ fontSize: "14px", color: "#78716c", margin: 0 }}>We'll help you fine-tune your resume to catch the eye of hiring managers.</p>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Resume Preview */}
          <div style={{ flex: "1 1 380px", minWidth: "300px", background: "#fff", borderRadius: "16px", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", background: "#fefcf9", borderBottom: "1px solid #f0ece6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#78716c" }}>📄 Resume Preview</span>
              <button style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #e7e5e4", background: "#fff", color: "#57534e", fontSize: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Update</button>
            </div>
            <div style={{ padding: "24px 20px", fontSize: "11px", lineHeight: 1.7, color: "#44403c" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 2px", color: "#1a1a1a", fontFamily: "'Source Serif 4', serif" }}>PRINCILLA ABENA KORANTENG</h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", fontSize: "10px", color: "#78716c", marginBottom: "14px" }}>
                <span>princilla0871@gmail.com</span><span>·</span><span>0594599824</span>
              </div>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "1px", margin: "0 0 3px", textTransform: "uppercase" }}>WEBSITES, PORTFOLIOS, PROFILES</p>
              <div style={{ marginBottom: "12px", fontSize: "10px", color: "#2563eb" }}>
                <p style={{ margin: "1px 0" }}>linkedin.com/in/princilla-abena-koranteng</p>
                <p style={{ margin: "1px 0" }}>github.com/alairdata</p>
              </div>
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "1px", margin: "0 0 3px", textTransform: "uppercase" }}>SUMMARY</p>
              <p style={{ fontSize: "10px", marginBottom: "14px", color: "#57534e", lineHeight: 1.7 }}>AI product builder and data scientist with 4+ years of experience spanning machine learning research, product analytics, and AI integration. Currently pursuing an MSc in Data Science (University of Ghana) with thesis research on Explainable Graph Neural Networks for misinformation detection. Built and launched So-UnFiltered AI — a consumer AI platform with 100+ users. Known in Ghana's tech community as "that tech girlie," creating data science and AI educational content across LinkedIn, YouTube, and TikTok.</p>
              
              <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "1px", margin: "0 0 5px", textTransform: "uppercase" }}>SKILLS</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "14px" }}>
                {["Python", "SQL", "JavaScript", "Scikit-learn", "PyTorch", "Graph Neural Networks", "NLP", "LLM Integration", "Explainable AI (XAI)", "Power BI", "Tableau", "Pandas", "NumPy", "Matplotlib", "Seaborn", "MySQL", "PostgreSQL", "Git/GitHub", "Streamlit", "Microsoft Office Suite", "Claude Code"].map(s => (
                  <span key={s} style={{ padding: "1px 6px", borderRadius: "3px", fontSize: "9px", background: "#f5f5f4", color: "#57534e", border: "1px solid #e7e5e4" }}>{s}</span>
                ))}
              </div>

              <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "1px", margin: "0 0 5px", textTransform: "uppercase" }}>EXPERIENCE</p>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: "#1a1a1a" }}>Intelligence Resource Engineer, Hubtel, Ghana</p>
                  <span style={{ fontSize: "9px", color: "#a8a29e", whiteSpace: "nowrap" }}>07/2025 – Present</span>
                </div>
                <p style={{ fontSize: "9.5px", color: "#57534e", margin: "3px 0 1px", lineHeight: 1.6 }}>• Developed Power BI dashboards tracking Home product performance against revenue and subscriber KPIs, improving visibility for senior leadership.</p>
                <p style={{ fontSize: "9.5px", color: "#57534e", margin: "1px 0", lineHeight: 1.6 }}>• Integrated LLMs into financial and operational reporting workflows, reducing strategic report preparation time by 50%.</p>
                <p style={{ fontSize: "9.5px", color: "#57534e", margin: "1px 0", lineHeight: 1.6 }}>• Led cross-functional analytics initiatives between Product, Intelligence, and Revenue teams to drive insight-based decision making.</p>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: "#1a1a1a" }}>Founder, So-UnFiltered AI</p>
                  <span style={{ fontSize: "9px", color: "#a8a29e", whiteSpace: "nowrap" }}>2024 – Present</span>
                </div>
                <p style={{ fontSize: "9.5px", color: "#57534e", margin: "3px 0 1px", lineHeight: 1.6 }}>• Built and launched a consumer AI chatbot platform serving 100+ active users.</p>
                <p style={{ fontSize: "9.5px", color: "#57534e", margin: "1px 0", lineHeight: 1.6 }}>• Conducted user behavior analysis, identifying retention patterns and implementing re-engagement campaigns.</p>
              </div>

              <p style={{ fontSize: "9px", fontWeight: 700, color: "#a8a29e", letterSpacing: "1px", margin: "0 0 5px", textTransform: "uppercase" }}>EDUCATION</p>
              <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 1px" }}>MSc Data Science — University of Ghana</p>
              <p style={{ fontSize: "9.5px", color: "#78716c", margin: "0 0 6px" }}>2024 – Present · Thesis: Explainable GNNs for Misinformation Detection</p>
              <p style={{ fontSize: "10px", fontWeight: 600, margin: "0 0 1px" }}>BSc Computer Science</p>
              <p style={{ fontSize: "9.5px", color: "#78716c", margin: 0 }}>2019 – 2023</p>
            </div>
          </div>

          {/* Right: Score + Feedback */}
          <div style={{ flex: "1 1 300px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}><ScoreTypeBadge type="strength" /></div>
              <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "17px", fontWeight: 700, margin: "0 0 4px" }}>Resume Strength Score</h3>
              <p style={{ fontSize: "11px", color: "#a8a29e", margin: "0 0 0" }}>How compelling is your resume to human recruiters?</p>
              <ScoreGauge value={fixStrength} type="strength" />
              <p style={{ fontSize: "10px", color: meta.color, margin: "10px 0 0", fontWeight: 500 }}>{meta.sub}</p>

              {/* Row: Improve Resume + Upload and Rescan */}
              <div style={{ display: "flex", gap: "8px", marginTop: "22px" }}>
                <button style={{
                  flex: 1, padding: "12px 8px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff",
                  fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 2px 10px rgba(255,140,66,0.2)",
                }}>Improve Resume</button>
                <button onClick={() => { setHasResume(false); setMode("fix"); setExpandedFeedback(null); }} style={{
                  flex: 1, padding: "12px 8px", borderRadius: "10px",
                  border: "1.5px solid #e7e5e4", background: "#fff",
                  color: "#57534e", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Upload & Rescan</button>
              </div>

              {/* Centered: Launch Job Search */}
              <button onClick={() => setMode("launch")} style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                border: "none", background: "rgba(255,140,66,0.06)",
                color: "#ea580c", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", marginTop: "10px",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,140,66,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,140,66,0.06)"}
              >Launch Job Search →</button>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>What you should fix:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {fixFeedback.map((item, i) => <FeedbackItem key={i} item={item} idx={`f${i}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── LAUNCH VIEW ───
  const LaunchView = () => {
    const meta = getStrengthMeta(launchStrength);
    return (
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderRadius: "16px", marginBottom: "24px", background: "linear-gradient(135deg, #fff7ed, #fef3e2)", border: "1px solid #fed7aa", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", boxShadow: "0 2px 10px rgba(255,140,66,0.25)" }}>✧</div>
            <div>
              <h1 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "22px", fontWeight: 800, margin: "0 0 2px" }}>Your job search is ready to be launched!</h1>
              <p style={{ fontSize: "13px", color: "#78716c", margin: 0 }}>Strength: <span style={{ color: "#16a34a", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{launchStrength}%</span> · Let's find your next role.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setMode("fix")} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e7e5e4", background: "#fff", color: "#57534e", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>📄 View Resume</button>
            <button onClick={() => { setHasResume(false); setMode("fix"); }} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e7e5e4", background: "#fff", color: "#57534e", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>↺ Rescan</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Left: Quick Tailor + Companion */}
          <div style={{ flex: "1 1 400px", minWidth: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Browser companion announcement */}
            <div style={{
              padding: "16px 20px", borderRadius: "14px",
              background: "linear-gradient(135deg, #fefcf9, #fff7ed)",
              border: "1px solid #fed7aa",
              display: "flex", alignItems: "center", gap: "14px",
            }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                background: "linear-gradient(135deg, #ff8c42, #ff6b35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "16px",
              }}>◎</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 2px", color: "#1a1a1a" }}>JobVest can follow you as you browse jobs</p>
                <p style={{ fontSize: "11px", color: "#78716c", margin: 0, lineHeight: 1.5 }}>Turn on the browser companion and tailor your resume with one click — on any job board, any listing.</p>
              </div>
              <button onClick={() => { setSidebarOpen(true); setTailorDone(false); setTailoring(false); setTailorProgress(0); }} style={{
                padding: "8px 16px", borderRadius: "8px", border: "none", whiteSpace: "nowrap",
                background: "#1a1a1a", color: "#fff", fontSize: "11px", fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Try it →</button>
            </div>
            <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "17px", fontWeight: 700, margin: "0 0 3px" }}>Quick Tailor</h3>
                  <p style={{ fontSize: "12px", color: "#78716c", margin: 0 }}>Paste a job description → tailored resume in minutes</p>
                </div>
                <ScoreTypeBadge type="ats" />
              </div>
              <p style={{ fontSize: "10px", color: "#a8a29e", margin: "4px 0 14px", lineHeight: 1.5 }}>
                Your Resume Strength is {launchStrength}% — but each job needs a different keyword mix. The ATS Score measures how well your resume matches a specific job description.
              </p>
              <div onClick={() => setQuickTailorJD(!quickTailorJD)} style={{ padding: "16px", borderRadius: "12px", minHeight: "90px", background: "#fefcf9", border: `1.5px dashed ${quickTailorJD ? "#ff8c42" : "#e7e5e4"}`, cursor: "text", marginBottom: "14px" }}>
                {quickTailorJD ? (
                  <p style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.7, margin: 0 }}>
                    <span style={{ fontWeight: 700, color: "#ff8c42" }}>Data Scientist — Safaricom PLC</span><br />
                    Proficiency in Python, TensorFlow/PyTorch, SQL, cloud platforms (AWS/GCP). Experience with A/B testing and stakeholder management required...
                  </p>
                ) : (
                  <p style={{ fontSize: "12px", color: "#a8a29e", margin: 0 }}>Paste a job description here...</p>
                )}
              </div>

              {quickTailorJD && !quickTailoring && !quickTailorDone && (
                <div>
                  <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#fefcf9", border: "1px solid #f0ece6", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px" }}>🤖</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#78716c" }}>ATS Score for this job:</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#78716c" }}>Current match</span>
                      <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#dc2626", fontWeight: 600 }}>68%</span>
                    </div>
                    <div style={{ height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden", marginBottom: "8px" }}>
                      <div style={{ height: "100%", width: "68%", background: "#dc2626", borderRadius: "4px" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#78716c" }}>After tailoring</span>
                      <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#16a34a", fontWeight: 600 }}>~83%</span>
                    </div>
                    <div style={{ height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "83%", background: "#16a34a", borderRadius: "4px" }} />
                    </div>
                    <p style={{ fontSize: "9px", color: "#a8a29e", margin: "8px 0 0" }}>Your resume is strong, but this role needs keywords you haven't emphasized. Tailoring will fix that.</p>
                  </div>
                  <button onClick={() => runTailor(setQuickTailorProgress, setQuickTailorDone, setQuickTailoring)} style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", boxShadow: "0 2px 12px rgba(255,140,66,0.2)" }}>✧ Tailor Now</button>
                </div>
              )}

              {quickTailoring && (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", margin: "0 auto 12px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#fff", animation: "gp 2s ease infinite" }}>✧</div>
                  <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Tailoring for this role...</p>
                  <p style={{ fontSize: "11px", color: "#a8a29e", margin: "0 0 14px" }}>Optimizing ATS Score · Data Scientist · Safaricom</p>
                  <div style={{ height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${quickTailorProgress}%`, background: "linear-gradient(90deg, #ff8c42, #ff6b35)", borderRadius: "4px", transition: "width 0.5s ease" }} />
                  </div>
                  <style>{`@keyframes gp { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }`}</style>
                </div>
              )}

              {quickTailorDone && (
                <div>
                  <ATSResultCard before={68} after={83} />
                  <div style={{ marginBottom: "14px", marginTop: "10px" }}>
                    {["6 bullets rewritten with role-specific metrics", "4 keywords added (TensorFlow, AWS, GCP, A/B Testing)", "Summary reframed around predictive modeling", "Skills reordered to match JD priority"].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "4px 0" }}>
                        <span style={{ color: "#16a34a", fontSize: "11px" }}>✓</span>
                        <span style={{ fontSize: "11px", color: "#57534e" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", boxShadow: "0 2px 10px rgba(255,140,66,0.2)" }}>↓ Download .docx</button>
                    <button style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e7e5e4", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: "#fff", color: "#57534e" }}>↓ .pdf</button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{ padding: "20px 24px", borderRadius: "16px", background: "#fff", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "15px", fontWeight: 700, margin: 0 }}>Recent Activity</h3>
                <button onClick={() => setTab("log")} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid #e7e5e4", background: "#fff", color: "#78716c", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View all →</button>
              </div>
              {applications.slice(0, 3).map((app, i) => {
                const st = statusMap[app.status];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? "1px solid #faf8f5" : "none" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>{app.role}</p>
                      <p style={{ fontSize: "11px", color: "#a8a29e", margin: "1px 0 0" }}>{app.company} · {app.date}</p>
                    </div>
                    <span style={{ padding: "4px 10px", borderRadius: "16px", fontSize: "10px", fontWeight: 600, background: st.bg, color: st.text }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Score + Feedback */}
          <div style={{ flex: "0 1 300px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 20px", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}><ScoreTypeBadge type="ats" /></div>
              <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "15px", fontWeight: 700, margin: "0 0 4px" }}>ATS Score</h3>
              <p style={{ fontSize: "10px", color: "#a8a29e", margin: "0 0 0" }}>How well does your resume pass automated screening?</p>
              <ScoreGauge value={launchStrength} type="ats" />
              <p style={{ fontSize: "10px", color: getATSMeta(launchStrength).color, margin: "8px 0 0", fontWeight: 500 }}>{getATSMeta(launchStrength).sub}</p>
              <p onClick={() => { setHasResume(false); setMode("fix"); }} style={{ fontSize: "11px", color: "#2563eb", margin: "12px 0 0", cursor: "pointer", fontWeight: 500 }}>↺ Upload and rescan</p>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid #f0ece6", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>What you should fix:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {launchFeedback.map((item, i) => <FeedbackItem key={i} item={item} idx={`l${i}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── APPLICATION LOG ───
  // ─── SIDEBAR ───
  const SidebarOverlay = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }}>
      <div style={{ flex: 1, padding: "40px", overflow: "auto", background: "#f8f9fa", fontFamily: "system-ui", color: "#1a1a1a" }} onClick={() => setSidebarOpen(false)}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "5px", background: "#0a66c2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700 }}>in</div>
            <span style={{ fontSize: "12px", color: "#888" }}>linkedin.com/jobs/view/3847291</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Data Scientist</h2>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 3px" }}>Safaricom PLC · Nairobi, Kenya</p>
          <p style={{ fontSize: "12px", color: "#999", margin: "0 0 20px" }}>Posted 2 days ago · 47 applicants</p>
          <div style={{ height: "1px", background: "#e0e0e0", margin: "0 0 20px" }} />
          <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 12px" }}>About the role</h3>
          <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.8 }}>We are looking for a Data Scientist to join our Analytics & Insights team. Strong experience with Python, ML frameworks, SQL, and data visualization tools required.</p>
          <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "20px 0 12px" }}>Requirements</h3>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: 2 }}>
            <p>• MSc in Data Science or related field</p>
            <p>• 2+ years in data science or analytics</p>
            <p>• Python, TensorFlow/PyTorch, SQL</p>
            <p>• Cloud platforms (AWS/GCP)</p>
            <p>• Tableau, Power BI</p>
          </div>
        </div>
      </div>
      <div onClick={e => e.stopPropagation()} style={{ width: "350px", background: "#fff", borderLeft: "1px solid #f0ece6", display: "flex", flexDirection: "column", overflow: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0ece6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", boxShadow: "0 2px 8px rgba(255,140,66,0.25)" }}>✧</div>
            <span style={{ fontSize: "14px", fontWeight: 700 }}><span style={{ color: "#ff8c42" }}>Job</span>Vest</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#a8a29e", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {!tailoring && !tailorDone ? (
          <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
            <div style={{ padding: "14px", borderRadius: "12px", background: "#fefcf9", border: "1px solid #f0ece6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px rgba(22,163,106,0.4)" }} />
                <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "#16a34a", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>Job Detected</span>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 1px" }}>Data Scientist</p>
              <p style={{ fontSize: "11px", color: "#78716c", margin: 0 }}>Safaricom PLC · Nairobi</p>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#fefcf9", border: "1px solid #f0ece6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#78716c" }}>Extracted Keywords</span>
                <span style={{ fontSize: "9px", color: "#a8a29e", fontFamily: "'JetBrains Mono', monospace" }}>14 found</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {["Python", "ML", "SQL", "TensorFlow", "AWS", "GCP", "Tableau", "A/B Testing"].map(kw => (
                  <span key={kw} style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: 600, background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }}>{kw}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#fefcf9", border: "1px solid #f0ece6", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>📄</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, margin: 0 }}>Master Resume</p>
                <p style={{ fontSize: "10px", color: "#a8a29e", margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>Princilla_Resume_2026.pdf</p>
              </div>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} />
            </div>
            <div style={{ padding: "12px 14px", borderRadius: "12px", background: "#fefcf9", border: "1px solid #f0ece6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px" }}>🤖</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#78716c" }}>ATS Score for this job</span>
              </div>
              {[{ l: "Current", v: "68%", w: "68%", c: "#dc2626" }, { l: "After tailoring", v: "~83%", w: "83%", c: "#16a34a" }].map((m, i) => (
                <div key={i} style={{ marginBottom: i === 0 ? "8px" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontSize: "10px", color: "#78716c" }}>{m.l}</span>
                    <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: m.c, fontWeight: 600 }}>{m.v}</span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: m.w, background: m.c, borderRadius: "3px" }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: "9px", color: "#a8a29e", margin: "6px 0 0" }}>Safe zone: 80-85% · Above 95% risks looking like spam</p>
            </div>
            <div style={{ marginTop: "auto" }}>
              <button onClick={() => runTailor(setTailorProgress, setTailorDone, setTailoring)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", boxShadow: "0 2px 12px rgba(255,140,66,0.25)" }}>✧ Tailor Resume for This Role</button>
              <p style={{ fontSize: "10px", color: "#a8a29e", textAlign: "center", margin: "8px 0 0" }}>Takes ~3 min · Downloads as .docx</p>
            </div>
          </div>
        ) : tailoring ? (
          <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", marginBottom: "16px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#fff", animation: "sbp 2s ease infinite" }}>✧</div>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "15px", fontWeight: 700, margin: "0 0 3px" }}>Tailoring...</h3>
            <p style={{ fontSize: "11px", color: "#a8a29e", margin: "0 0 20px" }}>Optimizing ATS Score · Safaricom</p>
            <div style={{ width: "100%", height: "4px", borderRadius: "4px", background: "#f1f5f9", overflow: "hidden", marginBottom: "20px" }}>
              <div style={{ height: "100%", width: `${tailorProgress}%`, background: "linear-gradient(90deg, #ff8c42, #ff6b35)", borderRadius: "4px", transition: "width 0.5s ease" }} />
            </div>
            {["Reading JD", "Extracting keywords", "Matching skills", "Rewriting bullets", "Optimizing", "ATS check", "Finalizing"].map((s, i) => {
              const done = tailorProgress >= [14, 32, 50, 68, 82, 95, 100][i];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", width: "100%" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "4px", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#ecfdf5" : "#f5f5f4", color: done ? "#16a34a" : "#d6d3d1", fontWeight: 700 }}>{done ? "✓" : i + 1}</div>
                  <span style={{ fontSize: "10px", color: done ? "#57534e" : "#d6d3d1" }}>{s}</span>
                </div>
              );
            })}
            <style>{`@keyframes sbp { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }`}</style>
          </div>
        ) : (
          <div style={{ padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", marginBottom: "14px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#16a34a" }}>✓</div>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "16px", fontWeight: 700, margin: "0 0 3px" }}>Resume Ready!</h3>
            <p style={{ fontSize: "11px", color: "#78716c", margin: "0 0 16px" }}>Tailored for Safaricom</p>
            <ATSResultCard before={68} after={83} />
            <div style={{ width: "100%", marginBottom: "16px", marginTop: "6px" }}>
              {["6 bullets rewritten with metrics", "4 keywords added naturally", "Summary tailored to JD", "Skills reordered"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "3px 0" }}>
                  <span style={{ color: "#16a34a", fontSize: "11px" }}>✓</span>
                  <span style={{ fontSize: "10px", color: "#57534e" }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
              <button style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", color: "#fff", boxShadow: "0 2px 12px rgba(255,140,66,0.2)" }}>↓ Download .docx</button>
              <button style={{ width: "100%", padding: "11px", borderRadius: "12px", border: "1px solid #e7e5e4", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", background: "#fff", color: "#57534e" }}>↓ Download .pdf</button>
              <button onClick={() => { setSidebarOpen(false); setTailorDone(false); setTailoring(false); }} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", color: "#a8a29e", background: "transparent" }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <Header />
      {tab === "home" && !hasResume && <OnboardingView />}
      {tab === "home" && hasResume && mode === "fix" && <FixView />}
      {tab === "home" && hasResume && mode === "launch" && <LaunchView />}
      {tab === "log" && <LogView />}
      {sidebarOpen && <SidebarOverlay />}
    </div>
  );
};

export default JobVest;
