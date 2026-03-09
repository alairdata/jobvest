import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Register listener FIRST so we catch all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Clean up OAuth tokens from URL after successful sign in
        if (event === "SIGNED_IN") {
          const hasTokens = window.location.hash.includes("access_token") ||
            window.location.search.includes("code=");
          if (hasTokens) {
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      }
    );

    // 2. Handle OAuth redirect: explicitly exchange code if present
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // PKCE flow: exchange the code for a session
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("OAuth code exchange failed:", error);
          setLoading(false);
        }
        // Success is handled by onAuthStateChange firing SIGNED_IN
        window.history.replaceState({}, "", window.location.pathname);
      });
    } else if (window.location.hash.includes("access_token")) {
      // Implicit flow: detectSessionInUrl should handle this,
      // but give it a moment then fall back to getSession
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
      // Normal page load: check for existing session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
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
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
