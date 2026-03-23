import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const EnvelopeSvg = () => (
  <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
    <ellipse cx="70" cy="105" rx="42" ry="5" fill="#dbeafe" opacity="0.7"/>
    <rect x="8" y="28" width="124" height="72" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
    <path d="M8 96 L70 64 L132 96" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1"/>
    <path d="M8 28 L70 64" stroke="#bfdbfe" strokeWidth="1" fill="none"/>
    <path d="M132 28 L70 64" stroke="#bfdbfe" strokeWidth="1" fill="none"/>
    <path d="M8 28 Q70 0 132 28 L70 58 Z" fill="#1d4ed8"/>
    <path d="M30 24 Q70 8 110 24" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="36" y="10" width="68" height="52" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
    <rect x="46" y="20" width="48" height="4" rx="2" fill="#bfdbfe"/>
    <rect x="46" y="29" width="38" height="3" rx="1.5" fill="#e0eeff"/>
    <rect x="46" y="36" width="42" height="3" rx="1.5" fill="#e0eeff"/>
    <rect x="46" y="43" width="30" height="3" rx="1.5" fill="#e0eeff"/>
    <circle cx="108" cy="28" r="14" fill="#2563eb"/>
    <path d="M102 28l4 4.5 8-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SparkleIcon1 = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2v4M10 14v4M2 10h4M14 10h4M4.3 4.3l2.8 2.8M12.9 12.9l2.8 2.8M4.3 15.7l2.8-2.8M12.9 7.1l2.8-2.8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="10" r="2.5" fill="#3b82f6"/>
  </svg>
);

const SparkleIcon2 = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v3M7 10v3M1 7h3M10 7h3M2.8 2.8l2 2M9.2 9.2l2 2M2.8 11.2l2-2M9.2 4.8l2-2" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon3 = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v2.5M6 8.5v2.5M1 6h2.5M8.5 6H11M2.8 2.8l1.5 1.5M7.7 7.7l1.5 1.5M2.8 9.2l1.5-1.5M7.7 4.3l1.5-1.5" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
    <rect x="0.5" y="0.5" width="16" height="12" rx="3" stroke="#1d4ed8" strokeWidth="1.2"/>
    <path d="M0.5 3l8 5.5 8-5.5" stroke="#1d4ed8" strokeWidth="1.2" fill="none"/>
  </svg>
);

const CONFETTI_COLORS = ["#1d4ed8", "#3b82f6", "#93c5fd", "#bfdbfe", "#60a5fa"];

const ConfirmEmailPage = ({ email, onBack }) => {
  const confettiRef = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      for (let i = 0; i < 36; i++) {
        setTimeout(() => {
          const el = document.createElement("div");
          const w = 6 + Math.random() * 5;
          const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          const radius = ["50%", "2px", "4px"][Math.floor(Math.random() * 3)];
          const duration = 1.2 + Math.random() * 1.6;
          const delay = Math.random() * 0.5;
          el.style.cssText = `position:fixed;left:${10 + Math.random() * 80}vw;top:0;width:${w}px;height:${w * (0.4 + Math.random() * 0.8)}px;background:${color};border-radius:${radius};pointer-events:none;z-index:5;animation:confettiFall ${duration}s linear ${delay}s both;`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 3000);
        }, i * 28);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  const steps = [
    { num: 1, active: true, title: "Open the email", desc: "Check your inbox or spam folder" },
    { num: 2, active: false, title: "Click the confirmation link", desc: "It'll bring you right back" },
    { num: 3, active: false, title: "You're in", desc: "Start building your profile" },
  ];

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { opacity:1; transform:translateY(-20px) rotate(0deg); }
          100% { opacity:0; transform:translateY(100vh) rotate(720deg); }
        }
        @keyframes envDrop {
          from { opacity:0; transform:translateY(-30px) scale(0.85); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes spPop {
          from { opacity:0; transform:scale(0); }
          to { opacity:1; transform:scale(1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50% { opacity:0.2; }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "420px", width: "90vw", textAlign: "center", padding: "48px 24px" }}>
        {/* Envelope */}
        <div
          style={{ position: "relative", display: "inline-block", marginBottom: "36px", animation: "envDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s both", cursor: "pointer" }}
        >
          <div className="env-body" style={{ transition: "transform 0.3s ease" }}>
            <EnvelopeSvg />
          </div>
          <div style={{ position: "absolute", top: "2px", right: "-18px", pointerEvents: "none", animation: "spPop 0.4s ease 0.8s both" }}>
            <SparkleIcon1 />
          </div>
          <div style={{ position: "absolute", top: "30px", left: "-20px", pointerEvents: "none", animation: "spPop 0.4s ease 1s both" }}>
            <SparkleIcon2 />
          </div>
          <div style={{ position: "absolute", bottom: "8px", right: "-14px", pointerEvents: "none", animation: "spPop 0.4s ease 1.2s both" }}>
            <SparkleIcon3 />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "10px", animation: "fadeUp 0.6s ease 0.4s both" }}>
          Confirm your email
        </h1>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 300, color: "#64748b", lineHeight: 1.8, marginBottom: "32px", maxWidth: "340px", animation: "fadeUp 0.6s ease 0.5s both" }}>
          We dropped a link in your inbox.<br />Open it to activate your JobVest account.
        </p>

        {/* Email box */}
        <div style={{
          width: "100%", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "28px", animation: "fadeUp 0.6s ease 0.6s both",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "9px", background: "#dbeafe",
            border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <EmailIcon />
          </div>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>
              Sent to
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e3a8a" }}>
              {email}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1d4ed8", animation: "blink 1.8s ease infinite" }} />
            <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 600 }}>Sent</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ width: "100%", marginBottom: "32px", animation: "fadeUp 0.6s ease 0.7s both" }}>
          {steps.map((step) => (
            <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "13px 0", borderBottom: step.num < 3 ? "1px solid #f1f5f9" : "none", textAlign: "left" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "1px",
                background: step.active ? "#dbeafe" : "#f1f5f9",
                border: step.active ? "1px solid #93c5fd" : "1px solid #e2e8f0",
                color: step.active ? "#1d4ed8" : "#94a3b8",
              }}>
                {step.num}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: step.active ? "#0f172a" : "#94a3b8", marginBottom: "2px" }}>
                  {step.title}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 300, color: "#94a3b8" }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 500, color: "#94a3b8",
            background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
            animation: "fadeUp 0.5s ease 0.85s both",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#1d4ed8"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
        >
          &larr; Back to sign in
        </button>
      </div>
    </>
  );
};

const AuthView = ({ onSkip, verifySuccess, verifying, verifyError }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        await signUp(email, password, name.trim());
        setCheckEmail(true);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = [
    { value: "83%", label: "Average ATS score after tailoring" },
    { value: "2min", label: "To tailor a resume per job" },
    { value: "3x", label: "More interview callbacks" },
  ];

  if (checkEmail) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", overflow: "hidden" }}>
        <ConfirmEmailPage email={email} onBack={() => { setCheckEmail(false); setIsSignUp(false); }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── LEFT: Brand Panel ─── */}
      <div className="hidden md:flex" style={{
        flex: "0 0 45%", minHeight: "100vh",
        background: "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #172554 100%)",
        padding: "48px",
        flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${(i % 4) * 28 + 5}%`,
              top: `${Math.floor(i / 4) * 35 + 8}%`,
              transform: `rotate(${i * 15 - 30}deg)`,
            }}>
              <Logo size={60 + (i % 3) * 20} />
            </div>
          ))}
        </div>

        {/* Top: Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          position: "relative", zIndex: 2,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <Logo size={32} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#93c5fd" }}>Job</span><span style={{ color: "#3b82f6" }}>Vest</span>
          </span>
        </div>

        {/* Middle: Hero message */}
        <div style={{
          position: "relative", zIndex: 2,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
        }}>
          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontSize: "38px", fontWeight: 800,
            color: "#fff", margin: "24px 0 12px", lineHeight: 1.15, letterSpacing: "-0.5px",
          }}>
            Dress your<br />job search<br /><span style={{ color: "#3b82f6" }}>right.</span>
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.6, maxWidth: "340px" }}>
            Upload once. Tailor to every job. Beat the bots, impress the humans.
          </p>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "24px", marginTop: "36px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}>
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{
                  fontSize: "24px", fontWeight: 800, margin: "0 0 2px",
                  fontFamily: "'Sora', sans-serif", color: "#3b82f6",
                }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#475569", margin: 0, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Testimonial */}
        <div style={{
          position: "relative", zIndex: 2,
          padding: "20px 24px", borderRadius: "14px",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease 0.8s",
        }}>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6, fontStyle: "italic" }}>
            "I went from mass-applying with the same resume to tailoring each one in 2 minutes. Got 3 interview calls in my first week."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "12px", fontWeight: 700,
            }}>AK</div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Ama Kwarteng</p>
              <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>Data Analyst · Accra</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Auth Form ─── */}
      <div style={{
        flex: 1, minHeight: "100vh", background: "#fafbfc",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 24px",
      }}>
        <div style={{
          width: "100%", maxWidth: "400px",
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.7s cubic-bezier(0.4,0,0.2,1) 0.3s",
        }}>
          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: "10px", marginBottom: "32px" }}>
            <Logo size={28} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 800 }}>
              <span style={{ color: "#3b82f6" }}>Job</span><span style={{ color: "#1e3a8a" }}>Vest</span>
            </span>
          </div>

          {verifySuccess && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#15803d" }}>
                Email verified! Sign in to continue.
              </span>
            </div>
          )}
          {verifying && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8" }}>
                Verifying your email...
              </span>
            </div>
          )}
          {verifyError && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
              background: "#fef2f2", border: "1px solid #fecaca",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#dc2626" }}>
                {verifyError}
              </span>
            </div>
          )}

          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontSize: "26px", fontWeight: 800,
            color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.3px",
          }}>
            {isSignUp ? "Create your account" : verifySuccess ? "You're verified!" : "Welcome back"}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 32px" }}>
            {isSignUp
              ? "Start tailoring your resume in minutes."
              : verifySuccess ? "Sign in to get started." : "Sign in to continue your job search."
            }
          </p>

          {/* Google Auth */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%", padding: "14px", borderRadius: "12px",
              border: "1px solid #e2e8f0", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#1e293b",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {isSignUp && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>Full name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: "1.5px solid #e2e8f0", background: "#fff",
                    fontSize: "14px", color: "#0f172a", outline: "none",
                    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: "14px", color: "#0f172a", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>Password</label>
                {!isSignUp && (
                  <span style={{ fontSize: "12px", color: "#3b82f6", cursor: "pointer", fontWeight: 500 }}>Forgot?</span>
                )}
              </div>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                required minLength={6}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: "14px", color: "#0f172a", outline: "none",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              {isSignUp && (
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>Must be at least 6 characters</p>
              )}
            </div>

            {error && (
              <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500, margin: 0 }}>{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: loading ? "#cbd5e1" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: loading ? "#64748b" : "#fff",
                fontSize: "14px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading ? "none" : "0 2px 12px rgba(59,130,246,0.25)",
                transition: "all 0.15s", marginTop: "4px",
              }}
            >
              {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          {/* Toggle */}
          <p style={{ fontSize: "13px", color: "#64748b", margin: "24px 0 0", textAlign: "center" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span
              onClick={() => { setIsSignUp(!isSignUp); setEmail(""); setPassword(""); setName(""); setError(""); }}
              style={{ color: "#3b82f6", fontWeight: 700, cursor: "pointer" }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </span>
          </p>

          {/* Terms */}
          {isSignUp && (
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
              By creating an account, you agree to our{" "}
              <span style={{ color: "#3b82f6", cursor: "pointer" }}>Terms of Service</span> and{" "}
              <span style={{ color: "#3b82f6", cursor: "pointer" }}>Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>

      <style>{`
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default AuthView;
