export const API_BASE = "https://jobvest.vercel.app/api";

export const STORAGE_KEYS = {
  RESUME: "jobvest_resume",
  APPLICATIONS: "jobvest_applications",
};

export const SITE_PATTERNS = [
  { pattern: /linkedin\.com\/jobs/i, name: "linkedin" },
  { pattern: /indeed\.com/i, name: "indeed" },
  { pattern: /glassdoor\.com\/(job-listing|Job)/i, name: "glassdoor" },
];

export const EXTENSION_ID = chrome.runtime.id;
