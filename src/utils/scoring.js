export const getStrengthMeta = (v) => {
  if (v >= 80) return { color: "#16a34a", label: "STRONG", sub: "Ideal zone (80-90%)" };
  if (v >= 70) return { color: "#2563eb", label: "PASS", sub: "Minimum pass — aim for 80%+" };
  if (v >= 60) return { color: "#d97706", label: "NEEDS WORK", sub: "Below pass mark (70%)" };
  return { color: "#dc2626", label: "TOO VAGUE", sub: "Major improvements needed" };
};

export const getATSMeta = (v) => {
  if (v >= 85) return { color: "#16a34a", label: "EXCELLENT", sub: "Strong match — resume covers most JD requirements" };
  if (v >= 70) return { color: "#2563eb", label: "GOOD", sub: "Good match — some gaps to address" };
  if (v >= 50) return { color: "#d97706", label: "PARTIAL", sub: "Significant gaps — tailoring recommended" };
  return { color: "#dc2626", label: "LOW", sub: "Major misalignment — needs tailoring" };
};

export const sIcon = (s) => {
  if (s === "good") return { bg: "#ecfdf5", border: "#bbf7d0", color: "#16a34a", icon: "✓" };
  if (s === "warning") return { bg: "#fffbeb", border: "#fde68a", color: "#d97706", icon: "!" };
  return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: "✕" };
};

export const launchStrength = 84;
