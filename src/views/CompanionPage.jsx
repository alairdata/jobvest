import { useState, useEffect } from "react";

const Logo = ({ size = 64 }) => (
  <svg width={size} height={size * 1.22} viewBox="0 0 64 78" fill="none">
    <defs>
      <linearGradient id="jvl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path d="M32 4 L56 14 L56 42 C56 58 44 68 32 74 C20 68 8 58 8 42 L8 14 Z" fill="none" stroke="url(#jvl)" strokeWidth="3" />
    <path d="M32 14 L18 22 L26 26 L32 40 Z" fill="#3b82f6" opacity="0.85" />
    <path d="M32 14 L46 22 L38 26 L32 40 Z" fill="#60a5fa" opacity="0.85" />
    <path d="M18 22 L12 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 22 L52 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="48" r="2" fill="#3b82f6" />
    <circle cx="32" cy="58" r="2" fill="#3b82f6" />
  </svg>
);

const CompanionPage = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-cycle through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Browse any job board",
      desc: "LinkedIn, Indeed, Glassdoor, company sites — just browse jobs like you normally would. JobVest is quietly waiting.",
      color: "#3b82f6",
    },
    {
      num: "02",
      title: "Click the JobVest icon",
      desc: "See a job you like? Click the JobVest extension icon in your browser toolbar. It instantly reads the page.",
      color: "#60a5fa",
    },
    {
      num: "03",
      title: "We extract everything",
      desc: "Keywords, skills, tools, qualifications — our AI pulls every detail the ATS will be looking for.",
      color: "#2563eb",
    },
    {
      num: "04",
      title: "One-click tailor",
      desc: "Hit 'Tailor' and your master resume gets rewritten to match — bullets, skills, summary, all optimized.",
      color: "#1d4ed8",
    },
    {
      num: "05",
      title: "Download and apply",
      desc: "Grab your tailored resume as .docx or .pdf. See your ATS score, the changes made, then go submit.",
      color: "#1e40af",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── HEADER ─── */}
      <header style={{
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #f1f5f9", background: "#fff", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #1e3a8a, #172554)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Logo size={16} />
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.4px" }}>
            <span style={{ color: "#3b82f6" }}>Job</span><span style={{ color: "#1e3a8a" }}>Vest</span>
          </span>
        </div>
        <button onClick={onBack} style={{
          padding: "8px 20px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff",
          fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 2px 10px rgba(59,130,246,0.2)",
        }}>← Back to app</button>
      </header>

      {/* ─── HERO ─── */}
      <section style={{
        padding: "80px 32px 60px", textAlign: "center",
        background: "linear-gradient(180deg, #fff 0%, #f0f7ff 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          backgroundImage: "radial-gradient(circle at 1px 1px, #dbeafe 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "640px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px", borderRadius: "20px", marginBottom: "20px",
            background: "#eff6ff", border: "1px solid #bfdbfe",
          }}>
            <span style={{ fontSize: "14px" }}>🧩</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#2563eb", fontFamily: "'JetBrains Mono', monospace" }}>CHROME EXTENSION</span>
          </div>

          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontSize: "44px", fontWeight: 800,
            color: "#0f172a", margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-1px",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
          }}>
            Your resume assistant,<br />right where you <span style={{ color: "#3b82f6" }}>browse.</span>
          </h1>

          <p style={{
            fontSize: "17px", color: "#64748b", margin: "0 0 36px", lineHeight: 1.6,
            opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.3s",
          }}>
            Stop copy-pasting job descriptions. JobVest follows you across job boards and tailors your resume with one click.
          </p>

          <div style={{
            display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
            opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.5s",
          }}>
            <button style={{
              padding: "16px 32px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff",
              fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
              display: "flex", alignItems: "center", gap: "10px",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(59,130,246,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.3)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#fff" opacity="0.5"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>
              Add to Chrome — It's free
            </button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: "16px 24px", borderRadius: "14px",
              border: "1.5px solid #e2e8f0", background: "#fff", color: "#334155",
              fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Watch demo</button>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — Interactive Steps ─── */}
      <section id="how-it-works" style={{ padding: "80px 32px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontSize: "11px", color: "#3b82f6", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>How it works</p>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>Five steps. Two minutes. One perfect resume.</h2>
        </div>

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: Step list */}
          <div style={{ flex: "1 1 300px", minWidth: "280px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {steps.map((step, i) => (
              <div key={i} onClick={() => setActiveStep(i)} style={{
                padding: "20px 22px", borderRadius: "14px", cursor: "pointer",
                background: activeStep === i ? "#fff" : "transparent",
                border: activeStep === i ? "1px solid #e2e8f0" : "1px solid transparent",
                boxShadow: activeStep === i ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
                transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: activeStep === i ? "8px" : "0" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700,
                    color: activeStep === i ? step.color : "#94a3b8",
                    transition: "color 0.3s",
                  }}>{step.num}</span>
                  <span style={{
                    fontSize: "15px", fontWeight: 700,
                    color: activeStep === i ? "#0f172a" : "#64748b",
                    transition: "color 0.3s",
                  }}>{step.title}</span>
                </div>
                <div style={{
                  maxHeight: activeStep === i ? "60px" : "0", overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 0 36px", lineHeight: 1.5 }}>{step.desc}</p>
                </div>
                {/* Progress bar */}
                {activeStep === i && (
                  <div style={{ marginTop: "12px", marginLeft: "36px", height: "3px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", background: step.color, borderRadius: "3px",
                      animation: "stepProgress 4s linear",
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Visual mockup */}
          <div style={{
            flex: "1 1 400px", minWidth: "320px", borderRadius: "20px", overflow: "hidden",
            background: "#0f172a", border: "1px solid #1e293b",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          }}>
            {/* Browser chrome bar */}
            <div style={{ padding: "12px 16px", background: "#1e293b", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #334155" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
              </div>
              <div style={{
                flex: 1, padding: "6px 12px", borderRadius: "6px", background: "#0f172a",
                fontSize: "11px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace",
                display: "flex", alignItems: "center", gap: "6px",
                overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
              }}>
                <span style={{ color: "#22c55e" }}>🔒</span>
                linkedin.com/jobs/data-scientist-safaricom
              </div>
              {/* Extension icon in toolbar */}
              <div style={{
                width: "24px", height: "24px", borderRadius: "5px", flexShrink: 0,
                background: "linear-gradient(135deg, #1e3a8a, #172554)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Logo size={12} />
              </div>
            </div>

            {/* Content area */}
            <div style={{ padding: "24px", minHeight: "340px", position: "relative" }}>
              {/* Step 1: Job page */}
              {activeStep === 0 && (
                <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "#0a66c2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 700 }}>in</div>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>LinkedIn Jobs</span>
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Data Scientist</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>Safaricom PLC · Nairobi, Kenya</p>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "10px" }}>Full-time</span>
                    <span style={{ padding: "3px 10px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", color: "#60a5fa", fontSize: "10px" }}>Remote OK</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#475569", lineHeight: 1.8 }}>
                    <p style={{ margin: "0 0 4px" }}>• Python, TensorFlow/PyTorch, SQL</p>
                    <p style={{ margin: "0 0 4px" }}>• Cloud platforms (AWS/GCP)</p>
                    <p style={{ margin: "0 0 4px" }}>• 2+ years experience in data science</p>
                    <p style={{ margin: 0, color: "#334155" }}>...</p>
                  </div>
                </div>
              )}

              {/* Step 2: Click the extension icon */}
              {activeStep === 1 && (
                <div style={{ animation: "fadeSlideIn 0.5s ease", textAlign: "center", padding: "16px 0" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 20px" }}>You see a job you like. Click the icon in your toolbar:</p>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "16px", margin: "0 auto 20px",
                    background: "linear-gradient(135deg, #1e3a8a, #172554)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 0 4px rgba(59,130,246,0.2), 0 0 0 8px rgba(59,130,246,0.1), 0 4px 20px rgba(59,130,246,0.3)",
                    animation: "pulse 1.5s infinite",
                    cursor: "pointer",
                  }}><Logo size={32} /></div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Click JobVest</p>
                  <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 20px" }}>The extension reads the page instantly</p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "10px 18px", borderRadius: "10px",
                    background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                  }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: "12px", color: "#93c5fd", fontWeight: 600 }}>Job listing detected — ready to tailor</span>
                  </div>
                </div>
              )}

              {/* Step 3: Keywords extracted */}
              {activeStep === 2 && (
                <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <Logo size={14} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#93c5fd" }}>Keywords Extracted</span>
                    <span style={{ fontSize: "10px", color: "#475569", fontFamily: "'JetBrains Mono', monospace", marginLeft: "auto" }}>14 found</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                    {["Python", "TensorFlow", "SQL", "Machine Learning", "AWS", "GCP", "Tableau", "A/B Testing", "PyTorch", "Data Viz", "Stakeholder Mgmt", "Power BI", "NLP", "Statistics"].map((kw, i) => (
                      <span key={kw} style={{
                        padding: "5px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 600,
                        background: i < 8 ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.06)",
                        color: i < 8 ? "#93c5fd" : "#475569",
                        border: `1px solid ${i < 8 ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.1)"}`,
                        animation: `fadeSlideIn 0.3s ease ${i * 0.05}s both`,
                      }}>{kw}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.15)", textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 2px" }}>Missing from resume</p>
                      <p style={{ fontSize: "18px", fontWeight: 700, color: "#f87171", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>6</p>
                    </div>
                    <div style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 2px" }}>Already matched</p>
                      <p style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>8</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Tailoring */}
              {activeStep === 3 && (
                <div style={{ animation: "fadeSlideIn 0.5s ease", textAlign: "center", padding: "20px 0" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "14px", margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: "pulse 2s infinite",
                  }}><Logo size={24} /></div>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Tailoring your resume...</p>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 24px" }}>Data Scientist · Safaricom PLC</p>
                  <div style={{ maxWidth: "280px", margin: "0 auto" }}>
                    {["Reading job description", "Matching keywords", "Rewriting bullets", "Optimizing ATS score", "Finalizing"].map((s, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: "10px", padding: "6px 0",
                        animation: `fadeSlideIn 0.3s ease ${i * 0.4}s both`,
                      }}>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "5px",
                          background: "rgba(59,130,246,0.15)", color: "#3b82f6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "9px", fontWeight: 700,
                        }}>✓</div>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Done */}
              {activeStep === 4 && (
                <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px", margin: "0 auto 12px",
                      background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", color: "#22c55e",
                    }}>✓</div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Resume ready!</p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "20px", padding: "16px", borderRadius: "12px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 2px", fontFamily: "'JetBrains Mono', monospace" }}>BEFORE</p>
                      <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "#f87171" }}>68%</span>
                    </div>
                    <span style={{ fontSize: "18px", color: "#22c55e", alignSelf: "center" }}>→</span>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 2px", fontFamily: "'JetBrains Mono', monospace" }}>AFTER</p>
                      <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "#4ade80" }}>83%</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{
                      flex: 1, padding: "12px", borderRadius: "10px", border: "none",
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff",
                      fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>↓ Download .docx</button>
                    <button style={{
                      padding: "12px 16px", borderRadius: "10px", border: "1px solid #334155",
                      background: "transparent", color: "#94a3b8",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>↓ .pdf</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section style={{ padding: "40px 32px 80px", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {[
            { icon: "🌐", title: "Works everywhere", desc: "LinkedIn, Indeed, Glassdoor, Wellfound, company career pages — if it's a job listing, we detect it." },
            { icon: "🎯", title: "Smart keyword matching", desc: "We don't just count keywords — we understand context, synonyms, and what ATS systems actually look for." },
            { icon: "⚡", title: "2-minute tailoring", desc: "From detection to download in under 2 minutes. No more spending an hour per application." },
            { icon: "🛡️", title: "Anti-spam protection", desc: "We keep your ATS score in the 80-85% safe zone. Above 95% looks like keyword stuffing — we prevent that." },
            { icon: "📊", title: "Score tracking", desc: "Every tailored resume gets scored. Track your ATS scores across all applications in one dashboard." },
            { icon: "🔒", title: "Your data stays yours", desc: "Your resume is stored locally. We never share your data with employers, recruiters, or third parties." },
          ].map((f, i) => (
            <div key={i} style={{
              padding: "28px 24px", borderRadius: "16px",
              background: "#fff", border: "1px solid #f1f5f9",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: "24px", display: "block", marginBottom: "14px" }}>{f.icon}</span>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>{f.title}</p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section style={{
        margin: "0 32px 48px", borderRadius: "24px", padding: "60px 48px",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #172554)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontSize: "32px", fontWeight: 800,
            color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px",
          }}>Ready to dress your job search right?</h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 32px" }}>Free to install. No credit card needed.</p>
          <button style={{
            padding: "18px 36px", borderRadius: "14px", border: "none",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff",
            fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 24px rgba(59,130,246,0.35)",
            display: "inline-flex", alignItems: "center", gap: "10px",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>
            Add to Chrome — It's free
          </button>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes stepProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CompanionPage;
