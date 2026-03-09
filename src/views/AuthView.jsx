import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Logo = ({ size = 64 }) => (
  <svg width={size} height={size * 1.22} viewBox="0 0 64 78" fill="none">
    <defs>
      <linearGradient id="jvlogo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path d="M32 4 L56 14 L56 42 C56 58 44 68 32 74 C20 68 8 58 8 42 L8 14 Z" fill="none" stroke="url(#jvlogo)" strokeWidth="3" />
    <path d="M32 14 L18 22 L26 26 L32 40 Z" fill="#3b82f6" opacity="0.85" />
    <path d="M32 14 L46 22 L38 26 L32 40 Z" fill="#60a5fa" opacity="0.85" />
    <path d="M18 22 L12 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 22 L52 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="48" r="2" fill="#3b82f6" />
    <circle cx="32" cy="58" r="2" fill="#3b82f6" />
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

const AuthView = ({ onSkip }) => {
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafbfc", fontFamily: "'DM Sans', sans-serif", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{
            width: "64px", height: "64px", margin: "0 auto 24px", borderRadius: "16px",
            background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", color: "#16a34a",
          }}>✓</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
            Check your email
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
            We sent a confirmation link to <strong style={{ color: "#0f172a" }}>{email}</strong>.
            Click the link to activate your account, then come back here.
          </p>
          <button
            onClick={() => { setCheckEmail(false); setIsSignUp(false); }}
            style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 700, cursor: "pointer", background: "none", border: "none", fontFamily: "'DM Sans', sans-serif" }}
          >
            Back to sign in
          </button>
        </div>
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
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg, #1e3a8a, #172554)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Logo size={20} /></div>
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
            <Logo size={20} />
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 800 }}>
              <span style={{ color: "#3b82f6" }}>Job</span><span style={{ color: "#1e3a8a" }}>Vest</span>
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontSize: "26px", fontWeight: 800,
            color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.3px",
          }}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 32px" }}>
            {isSignUp
              ? "Start tailoring your resume in minutes."
              : "Sign in to continue your job search."
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

          {/* Guest mode */}
          <button
            onClick={onSkip}
            style={{
              width: "100%", marginTop: "16px", padding: "12px",
              fontSize: "13px", color: "#94a3b8", fontWeight: 600,
              cursor: "pointer", background: "none", border: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#64748b"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            Continue without an account
          </button>

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
