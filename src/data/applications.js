export const applications = [
  { role: "Data Scientist", company: "Safaricom PLC", status: "applied", date: "Feb 27", ats: 83, platform: "LinkedIn" },
  { role: "ML Engineer", company: "MTN Ghana", status: "interview", date: "Feb 24", ats: 82, platform: "Indeed" },
  { role: "AI Research Analyst", company: "Google DeepMind", status: "applied", date: "Feb 22", ats: 79, platform: "Careers" },
  { role: "Data Analyst", company: "Hubtel", status: "rejected", date: "Feb 18", ats: 72, platform: "LinkedIn" },
  { role: "Data Scientist II", company: "Flutterwave", status: "pending", date: "Feb 15", ats: 81, platform: "Wellfound" },
  { role: "Analytics Engineer", company: "Andela", status: "applied", date: "Feb 12", ats: 84, platform: "LinkedIn" },
];

export const allStatuses = [
  { key: "applied", bg: "#eff6ff", text: "#2563eb", label: "Applied" },
  { key: "interview", bg: "#ecfdf5", text: "#16a34a", label: "Interview" },
  { key: "offered", bg: "#f0fdf4", text: "#15803d", label: "Offered" },
  { key: "accepted", bg: "#dcfce7", text: "#166534", label: "Accepted" },
  { key: "rejected", bg: "#fef2f2", text: "#dc2626", label: "Rejected" },
  { key: "withdrawn", bg: "#f5f5f4", text: "#78716c", label: "Withdrawn" },
  { key: "pending", bg: "#fffbeb", text: "#d97706", label: "Pending" },
];

export const statusMap = {};
allStatuses.forEach((s) => {
  statusMap[s.key] = { bg: s.bg, text: s.text, label: s.label };
});
