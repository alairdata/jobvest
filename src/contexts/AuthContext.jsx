import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(null); // null = unknown, true/false = checked

  // Check email_verified status from profiles table
  const checkEmailVerified = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_verified")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      const verified = data?.email_verified ?? false;
      setEmailVerified(verified);
      return verified;
    } catch (err) {
      console.warn("Failed to check email verification:", err);
      setEmailVerified(false);
      return false;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          // Check if Google user (always verified) or email user
          const provider = currentUser.app_metadata?.provider;
          if (provider === "google") {
            setEmailVerified(true);
          } else {
            checkEmailVerified(currentUser.id);
          }
        } else {
          setEmailVerified(null);
        }

        // Clean up OAuth tokens from URL
        if (event === "SIGNED_IN") {
          const hasTokens = window.location.hash.includes("access_token") ||
            window.location.search.includes("code=");
          if (hasTokens) {
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      }
    );

    // Handle OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("OAuth code exchange failed:", error);
          setLoading(false);
        }
        window.history.replaceState({}, "", window.location.pathname);
      });
    } else if (window.location.hash.includes("access_token")) {
      setTimeout(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            setUser(session.user);
            setLoading(false);
            window.history.replaceState({}, "", window.location.pathname);
          }
        });
      }, 500);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    // Create user server-side (skips Supabase's built-in confirmation email)
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Signup failed");
    }

    // Don't sign in — user must verify email first
    return { needsVerification: true };
  };

  const resendVerification = async () => {
    if (!user) return;
    const res = await fetch("/api/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || "",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to resend verification email");
    }
  };

  const verifyToken = async (token) => {
    const res = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Verification failed");
    }
    setEmailVerified(true);
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message === "Invalid login credentials") {
        throw new Error("No account found. Create a new account instead.");
      }
      throw error;
    }
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setEmailVerified(null);
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Not signed in");
    const res = await fetch("/api/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete account");
    }
    await supabase.auth.signOut();
    setEmailVerified(null);
  };

  const value = {
    user,
    loading,
    emailVerified,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    deleteAccount,
    resendVerification,
    verifyToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
