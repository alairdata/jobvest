const API_BASE = "https://jobvest.vercel.app/api";
const STORAGE_KEY_RESUME = "jobvest_resume";

// Relay API calls from content script to avoid CORS
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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

    return true; // keep channel open for async response
  }
});

// Handle resume sync from main app (externally_connectable)
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SYNC_RESUME") {
    chrome.storage.local.set({ [STORAGE_KEY_RESUME]: msg.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (msg.type === "CHECK_RESUME") {
    chrome.storage.local.get(STORAGE_KEY_RESUME, (result) => {
      const resume = result[STORAGE_KEY_RESUME];
      sendResponse({
        synced: !!resume,
        name: resume?.resumeFileName || null,
        date: resume?.syncDate || null,
      });
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
