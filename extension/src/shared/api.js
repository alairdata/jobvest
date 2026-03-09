// All API calls go through the background service worker to avoid CORS

export const scoreResume = (resumeText, jdText) =>
  chrome.runtime.sendMessage({
    type: "API_CALL",
    endpoint: "/ats-score",
    body: { resumeText, jdText },
  });

export const tailorResume = (resumeText, jdText) =>
  chrome.runtime.sendMessage({
    type: "API_CALL",
    endpoint: "/tailor",
    body: { resumeText, jdText },
  });
