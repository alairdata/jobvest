import { signInWithGoogle, restoreSession, fetchResumeFromSupabase, signOut } from "../shared/auth.js";

const API_BASE = "https://jobvest.vercel.app/api";

// Handle messages from content script / sidebar
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Relay API calls to avoid CORS
  if (msg.type === "API_CALL") {
    fetch(`${API_BASE}${msg.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg.body),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => ({ error: e.error || `HTTP ${res.status}` }));
        return res.json();
      })
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  // Google sign-in via chrome.identity
  if (msg.type === "SIGN_IN_GOOGLE") {
    signInWithGoogle()
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  // Restore existing session
  if (msg.type === "RESTORE_SESSION") {
    restoreSession()
      .then((result) => sendResponse(result || { error: "No session" }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  // Fetch resume from Supabase
  if (msg.type === "FETCH_RESUME") {
    fetchResumeFromSupabase(msg.accessToken, msg.userId)
      .then((resume) => sendResponse({ resume }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  // Sign out
  if (msg.type === "SIGN_OUT") {
    signOut()
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});

// Handle resume sync from main app (externally_connectable)
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SYNC_RESUME") {
    chrome.storage.local.set({ jobvest_resume: msg.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Badge: show "JV" on supported job sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  const isJobPage = /linkedin\.com\/jobs|indeed\.com|glassdoor\.com\/(job-listing|Job)/i.test(tab.url);
  if (isJobPage) {
    chrome.action.setBadgeText({ text: "JV", tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#3b82f6", tabId });
  } else {
    chrome.action.setBadgeText({ text: "", tabId });
  }
});
