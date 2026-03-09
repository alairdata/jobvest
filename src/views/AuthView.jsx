import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Logo = ({ size = 48 }) => (
  <svg width={size} height={size * 1.22} viewBox="0 0 64 78" fill="none">
    <defs>
      <linearGradient id="jva" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path d="M32 4 L56 14 L56 42 C56 58 44 68 32 74 C20 68 8 58 8 42 L8 14 Z" fill="none" stroke="url(#jva)" strokeWidth="3" />
    <path d="M32 14 L18 22 L26 26 L32 40 Z" fill="#3b82f6" opacity="0.85" />
    <path d="M32 14 L46 22 L38 26 L32 40 Z" fill="#60a5fa" opacity="0.85" />
    <path d="M18 22 L12 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 22 L52 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="48" r="2" fill="#3b82f6" />
    <circle cx="32" cy="58" r="2" fill="#3b82f6" />
  </svg>
);

const AuthView = ({ onSkip }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

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

  if (checkEmail) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-50 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="font-heading text-2xl font-extrabold mb-3 text-[#1a1a1a]">
            Check your email
          </h1>
          <p className="text-[14px] text-stone-500 leading-relaxed mb-6">
            We sent a confirmation link to <strong className="text-[#1a1a1a]">{email}</strong>.
            Click the link to activate your account, then come back here.
          </p>
          <button
            onClick={() => {
              setCheckEmail(false);
              setIsSignUp(false);
            }}
            className="text-[13px] text-brand font-semibold cursor-pointer bg-transparent border-none font-sans"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-fit">
            <Logo size={48} />
          </div>
          <h1 className="font-heading text-[28px] font-extrabold text-[#1a1a1a]">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-[14px] text-stone-500 mt-1.5">
            {isSignUp
              ? "Sign up to sync your data across devices"
              : "Sign in to pick up where you left off"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-warm-border shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 px-4 rounded-xl border border-stone-200 bg-white text-[14px] font-semibold text-[#1a1a1a] cursor-pointer font-sans flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isSignUp && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full py-3 px-4 rounded-xl border border-stone-200 text-[14px] text-[#1a1a1a] font-sans focus:outline-none focus:border-brand transition-colors"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full py-3 px-4 rounded-xl border border-stone-200 text-[14px] text-[#1a1a1a] font-sans focus:outline-none focus:border-brand transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full py-3 px-4 rounded-xl border border-stone-200 text-[14px] text-[#1a1a1a] font-sans focus:outline-none focus:border-brand transition-colors"
            />

            {error && (
              <p className="text-[13px] text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl border-none text-[14px] font-bold cursor-pointer font-sans transition-all ${
                loading
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(59,130,246,0.2)]"
              }`}
            >
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-[13px] text-stone-500 mt-5">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-brand font-semibold cursor-pointer bg-transparent border-none font-sans text-[13px]"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        {/* Guest mode */}
        <button
          onClick={onSkip}
          className="w-full mt-4 py-3 text-[13px] text-stone-400 font-semibold cursor-pointer bg-transparent border-none font-sans hover:text-stone-600 transition-colors"
        >
          Continue without an account
        </button>
      </div>
    </div>
  );
};

export default AuthView;
