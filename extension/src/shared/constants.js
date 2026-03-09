export const API_BASE = "https://jobvest.vercel.app/api";

export const SUPABASE_URL = "https://ycuazkcjetvdcxgctlwh.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdWF6a2NqZXR2ZGN4Z2N0bHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDgwMjIsImV4cCI6MjA4ODU4NDAyMn0.Wcanht6y-nbp51-5TCseZU8b_UamF2n6HbrHjKaxMoo";

export const STORAGE_KEYS = {
  RESUME: "jobvest_resume",
  APPLICATIONS: "jobvest_applications",
  SESSION: "jobvest_session",
};

export const SITE_PATTERNS = [
  { pattern: /linkedin\.com\/jobs/i, name: "linkedin" },
  { pattern: /indeed\.com/i, name: "indeed" },
  { pattern: /glassdoor\.com\/(job-listing|Job)/i, name: "glassdoor" },
];
