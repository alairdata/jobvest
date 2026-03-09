import { SUPABASE_URL, SUPABASE_ANON_KEY, STORAGE_KEYS } from "./constants";

const headers = (accessToken) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

// Get the extension's OAuth redirect URL
const getRedirectUrl = () =>
  `https://${chrome.runtime.id}.chromiumapp.org/`;

// Sign in with Google via Supabase OAuth + chrome.identity
export const signInWithGoogle = () =>
  new Promise((resolve, reject) => {
    const redirectUrl = getRedirectUrl();
    const authUrl =
      `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;

    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (responseUrl) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        if (!responseUrl) {
          return reject(new Error("No response from auth flow"));
        }

        try {
          // Parse tokens from hash fragment
          const url = new URL(responseUrl);
          const params = new URLSearchParams(url.hash.substring(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          const expires_in = parseInt(params.get("expires_in") || "3600", 10);

          if (!access_token) {
            return reject(new Error("No access token in response"));
          }

          const expires_at = Math.floor(Date.now() / 1000) + expires_in;

          // Get user info
          const user = await getUser(access_token);

          // Store session
          const session = { access_token, refresh_token, expires_at };
          await saveSession({ session, user });

          resolve({ session, user });
        } catch (err) {
          reject(err);
        }
      }
    );
  });

// Get user profile from Supabase
export const getUser = async (accessToken) => {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: headers(accessToken),
  });
  if (!res.ok) throw new Error("Failed to get user");
  return res.json();
};

// Refresh the session using refresh token
export const refreshSession = async (refreshToken) => {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error("Token refresh failed");
  const data = await res.json();
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
  };
  const user = data.user || (await getUser(data.access_token));
  await saveSession({ session, user });
  return { session, user };
};

// Restore existing session from storage
export const restoreSession = async () => {
  const stored = await getStoredSession();
  if (!stored || !stored.session) return null;

  const { session, user } = stored;
  const now = Math.floor(Date.now() / 1000);

  // If token expires in < 60s, refresh
  if (session.expires_at && session.expires_at - now < 60) {
    if (session.refresh_token) {
      try {
        return await refreshSession(session.refresh_token);
      } catch {
        await clearSession();
        return null;
      }
    }
    await clearSession();
    return null;
  }

  // Validate token
  try {
    const validUser = await getUser(session.access_token);
    return { session, user: validUser };
  } catch {
    // Try refresh
    if (session.refresh_token) {
      try {
        return await refreshSession(session.refresh_token);
      } catch {
        await clearSession();
        return null;
      }
    }
    await clearSession();
    return null;
  }
};

// Fetch resume from Supabase resumes table
export const fetchResumeFromSupabase = async (accessToken, userId) => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/resumes?user_id=eq.${userId}&select=*`,
    {
      headers: {
        ...headers(accessToken),
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  if (res.status === 406 || res.status === 404) return null; // no resume
  if (!res.ok) throw new Error("Failed to fetch resume");
  const data = await res.json();
  if (!data || !data.resume_text) return null;

  return {
    resumeText: data.resume_text,
    resumeFileName: data.file_name || "",
    resumeScore: data.score ?? null,
    resumeFeedback: data.feedback ?? null,
    candidateName: data.candidate_name || "",
    syncDate: Date.now(),
  };
};

// Sign out
export const signOut = async () => {
  const stored = await getStoredSession();
  if (stored?.session?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: headers(stored.session.access_token),
      });
    } catch { /* ignore logout errors */ }
  }
  await clearSession();
};

// Storage helpers
const getStoredSession = () =>
  new Promise((resolve) =>
    chrome.storage.local.get(STORAGE_KEYS.SESSION, (r) =>
      resolve(r[STORAGE_KEYS.SESSION] || null)
    )
  );

const saveSession = (data) =>
  new Promise((resolve) =>
    chrome.storage.local.set({ [STORAGE_KEYS.SESSION]: data }, resolve)
  );

const clearSession = () =>
  new Promise((resolve) =>
    chrome.storage.local.remove([STORAGE_KEYS.SESSION, STORAGE_KEYS.RESUME], resolve)
  );
