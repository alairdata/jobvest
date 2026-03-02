export const getStrengthMeta = (v) => {
  if (v >= 80) return { color: "#16a34a", label: "STRONG", sub: "Ideal zone (80-90%)" };
  if (v >= 70) return { color: "#2563eb", label: "PASS", sub: "Minimum pass — aim for 80%+" };
  if (v >= 60) return { color: "#d97706", label: "NEEDS WORK", sub: "Below pass mark (70%)" };
  return { color: "#dc2626", label: "TOO VAGUE", sub: "Major improvements needed" };
};

export const getATSMeta = (v) => {
  if (v >= 95) return { color: "#dc2626", label: "SPAM RISK", sub: "May look like keyword stuffing to recruiters" };
  if (v >= 80) return { color: "#16a34a", label: "IDEAL", sub: "Safe zone (80-85%)" };
  if (v >= 75) return { color: "#2563eb", label: "PASS", sub: "Minimum pass — tailoring can improve" };
  return { color: "#dc2626", label: "LOW", sub: "Likely filtered out by ATS" };
};

export const sIcon = (s) => {
  if (s === "good") return { bg: "#ecfdf5", border: "#bbf7d0", color: "#16a34a", icon: "✓" };
  if (s === "warning") return { bg: "#fffbeb", border: "#fde68a", color: "#d97706", icon: "!" };
  return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: "✕" };
};

export const launchStrength = 84;
