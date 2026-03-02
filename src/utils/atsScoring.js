// ── Stop words to filter from keyword extraction ──
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "as", "is", "was", "are", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "shall", "can", "need", "must", "it", "its", "you", "your",
  "we", "our", "they", "their", "this", "that", "these", "those", "i", "me",
  "my", "he", "she", "him", "her", "his", "not", "no", "so", "if", "up",
  "out", "about", "into", "over", "after", "before", "between", "under",
  "again", "then", "than", "also", "just", "more", "most", "very", "too",
  "any", "all", "each", "every", "both", "few", "some", "such", "own",
  "same", "other", "new", "old", "well", "also", "back", "even", "still",
  "us", "who", "what", "when", "where", "how", "which", "while", "during",
  "through", "above", "below", "here", "there", "because", "since", "until",
  "although", "though", "whether", "either", "neither", "nor", "yet",
  // Common job posting filler
  "role", "position", "job", "looking", "ideal", "candidate", "responsibilities",
  "requirements", "qualifications", "ability", "strong", "excellent", "good",
  "work", "working", "team", "company", "including", "etc", "per", "within",
  "across", "using", "based", "related", "required", "preferred", "plus",
  "minimum", "least", "years", "year", "experience",
]);

// ── Education level hierarchy ──
const EDU_LEVELS = [
  { level: 4, patterns: ["ph.d", "phd", "doctorate", "doctoral"] },
  { level: 3, patterns: ["master", "m.s.", "m.a.", "m.sc", "m.eng", "mba", "masters"] },
  { level: 2, patterns: ["bachelor", "b.s.", "b.a.", "b.sc", "b.eng", "bachelors", "undergraduate"] },
  { level: 1, patterns: ["associate", "diploma", "certificate", "certification"] },
];

// ── Standard ATS section headers ──
const ATS_HEADERS = {
  experience: ["experience", "work experience", "professional experience", "employment history", "employment"],
  education: ["education", "academic background", "academic"],
  skills: ["skills", "technical skills", "core competencies", "competencies"],
  summary: ["summary", "professional summary", "objective", "profile", "career objective"],
};

// ── Red-flag creative headers ──
const RED_FLAG_HEADERS = [
  "my journey", "what i do", "the story so far", "toolbox", "superpowers",
  "my story", "who i am", "my toolkit", "my world", "adventures",
];

/**
 * Extract meaningful keywords (unigrams + bigrams) from text.
 * Returns a Map of keyword → count.
 */
function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

  const keywords = new Map();

  // Unigrams
  for (const w of words) {
    keywords.set(w, (keywords.get(w) || 0) + 1);
  }

  // Bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    keywords.set(bigram, (keywords.get(bigram) || 0) + 1);
  }

  return keywords;
}

/**
 * Find the text content of a resume section by header name.
 */
function findSection(text, aliases) {
  const lower = text.toLowerCase();
  for (const alias of aliases) {
    const idx = lower.indexOf(alias);
    if (idx !== -1) {
      return text.slice(idx, idx + 800).toLowerCase();
    }
  }
  return "";
}

/**
 * Detect highest education level in text.
 * Returns { level: number, label: string } or null.
 */
function detectEducation(text) {
  const lower = text.toLowerCase();
  for (const edu of EDU_LEVELS) {
    if (edu.patterns.some((p) => lower.includes(p))) {
      return { level: edu.level, label: edu.patterns[0] };
    }
  }
  return null;
}

/**
 * Extract years-of-experience requirement from JD text.
 * Looks for patterns like "3+ years", "5-7 years", "minimum 3 years".
 */
function extractRequiredYears(jdText) {
  const match = jdText.match(/(\d+)\+?\s*(?:-\s*\d+\s*)?years?\s/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Estimate years of experience from resume date ranges.
 * Looks for year patterns like "2018 - 2022", "2019 - Present".
 */
function estimateResumeYears(resumeText) {
  const yearPattern = /\b(20\d{2}|19\d{2})\s*[-–—to]+\s*(20\d{2}|19\d{2}|present|current)\b/gi;
  let totalYears = 0;
  let match;
  while ((match = yearPattern.exec(resumeText)) !== null) {
    const start = parseInt(match[1], 10);
    const end = /present|current/i.test(match[2])
      ? new Date().getFullYear()
      : parseInt(match[2], 10);
    if (end >= start) {
      totalYears += end - start;
    }
  }
  return totalYears;
}

/**
 * Score a resume against a job description using ATS criteria.
 *
 * @param {string} resumeText - The extracted resume text
 * @param {string} jdText - The job description text
 * @returns {{ score: number, feedback: Array, missedKeywords: string[], density: number }}
 */
export function scoreATS(resumeText, jdText) {
  if (!resumeText || !jdText) {
    return { score: 0, feedback: [], missedKeywords: [], density: 0 };
  }

  const feedback = [];
  let total = 0;
  const resumeLower = resumeText.toLowerCase();

  // ════════════════════════════════════════════════════════════
  // 1. KEYWORD OPTIMIZATION & DENSITY (45 pts max)
  // ════════════════════════════════════════════════════════════
  const jdKeywords = extractKeywords(jdText);
  const resumeKeywords = extractKeywords(resumeText);

  // Filter JD keywords to meaningful ones (appear at least once in JD, length > 2)
  const meaningfulJdKeywords = new Map();
  for (const [kw, count] of jdKeywords) {
    if (kw.length > 2 && count >= 1) {
      meaningfulJdKeywords.set(kw, count);
    }
  }

  // Count matches
  let matchedCount = 0;
  let weightedMatches = 0;
  const missedKeywords = [];

  // Get summary section for placement weighting
  const summarySection = findSection(resumeText, ATS_HEADERS.summary);

  for (const [kw] of meaningfulJdKeywords) {
    if (resumeKeywords.has(kw)) {
      matchedCount++;
      // Placement bonus: keywords in summary score 1.5x
      const inSummary = summarySection.includes(kw);
      weightedMatches += inSummary ? 1.5 : 1;
    } else {
      missedKeywords.push(kw);
    }
  }

  const totalJdKeywords = meaningfulJdKeywords.size;
  const matchRate = totalJdKeywords > 0 ? weightedMatches / totalJdKeywords : 0;

  // Keyword density check
  const resumeWords = resumeText.split(/\s+/).filter(Boolean);
  const resumeWordCount = resumeWords.length;
  const jdMatchedInResume = [...meaningfulJdKeywords.keys()].filter((kw) =>
    resumeKeywords.has(kw)
  );
  const keywordOccurrences = jdMatchedInResume.reduce(
    (sum, kw) => sum + (resumeKeywords.get(kw) || 0),
    0
  );
  const density = resumeWordCount > 0
    ? (keywordOccurrences / resumeWordCount) * 100
    : 0;

  // Score keyword match (up to 40 pts based on match rate)
  let keywordScore = Math.round(Math.min(matchRate, 1) * 40);

  // Density bonus/penalty (up to 5 pts)
  let densityBonus = 0;
  let densityNote = "";
  if (density >= 2 && density <= 3) {
    densityBonus = 5;
    densityNote = "Keyword density is optimal (2-3%)";
  } else if (density >= 1.5 && density < 2) {
    densityBonus = 3;
    densityNote = "Keyword density is slightly low";
  } else if (density > 3 && density <= 5) {
    densityBonus = 3;
    densityNote = "Keyword density is slightly high";
  } else if (density > 5) {
    densityBonus = -5;
    densityNote = "Keyword density is too high — risk of keyword stuffing";
  } else {
    densityBonus = 1;
    densityNote = "Low keyword density — add more JD-relevant terms";
  }

  keywordScore = Math.max(0, Math.min(45, keywordScore + densityBonus));
  total += keywordScore;

  // Sort missed keywords by JD frequency (most important first), only unigrams for display
  const topMissed = missedKeywords
    .filter((kw) => !kw.includes(" ") && kw.length > 3)
    .sort((a, b) => (jdKeywords.get(b) || 0) - (jdKeywords.get(a) || 0))
    .slice(0, 8);

  const matchPct = totalJdKeywords > 0
    ? Math.round((matchedCount / totalJdKeywords) * 100)
    : 0;

  if (keywordScore >= 35) {
    feedback.push({
      section: "Keyword Match",
      status: "good",
      msg: `${matchPct}% of JD keywords found in resume`,
      details: `${matchedCount}/${totalJdKeywords} keywords matched. ${densityNote}. Density: ${density.toFixed(1)}%.${topMissed.length ? ` Consider adding: ${topMissed.slice(0, 3).join(", ")}.` : ""}`,
    });
  } else if (keywordScore >= 20) {
    feedback.push({
      section: "Keyword Match",
      status: "warning",
      msg: `${matchPct}% keyword match — needs improvement`,
      details: `${matchedCount}/${totalJdKeywords} keywords matched. ${densityNote}. Density: ${density.toFixed(1)}%.${topMissed.length ? ` Missing high-priority keywords: ${topMissed.slice(0, 5).join(", ")}.` : ""}`,
    });
  } else {
    feedback.push({
      section: "Keyword Match",
      status: "error",
      msg: `Only ${matchPct}% keyword match — likely filtered by ATS`,
      details: `${matchedCount}/${totalJdKeywords} keywords matched. ${densityNote}. Density: ${density.toFixed(1)}%.${topMissed.length ? ` Missing critical keywords: ${topMissed.join(", ")}.` : ""} Tailor your resume to include these terms naturally.`,
    });
  }

  // ════════════════════════════════════════════════════════════
  // 2. FORMATTING & PARSING ACCURACY (23 pts max)
  // ════════════════════════════════════════════════════════════
  let formatScore = 0;

  // Check for standard ATS headers (up to 12 pts)
  let headersFound = 0;
  const missingHeaders = [];
  for (const [category, aliases] of Object.entries(ATS_HEADERS)) {
    const found = aliases.some((alias) => {
      const regex = new RegExp(`(^|\\n)\\s*${alias}\\s*(\\n|:|$)`, "im");
      return regex.test(resumeText) || resumeLower.includes(alias);
    });
    if (found) headersFound++;
    else missingHeaders.push(category);
  }
  formatScore += headersFound * 3; // 3 pts per header, max 12

  // Red-flag creative headers penalty (up to -3)
  const redFlags = RED_FLAG_HEADERS.filter((h) => resumeLower.includes(h));
  if (redFlags.length > 0) formatScore -= Math.min(redFlags.length * 2, 3);

  // Parsing blockers check (up to 8 pts)
  const specialCharCount = (resumeText.match(/[^\w\s.,;:!?'"()\-–—@/\\#$%&*+\n]/g) || []).length;
  const specialCharRatio = resumeText.length > 0 ? specialCharCount / resumeText.length : 0;
  const hasTableIndicators = /\t.*\t.*\t/m.test(resumeText) || /\|.*\|.*\|/m.test(resumeText);

  if (specialCharRatio < 0.02 && !hasTableIndicators) {
    formatScore += 8;
  } else if (specialCharRatio < 0.05) {
    formatScore += 5;
  } else {
    formatScore += 2;
  }

  // Consistent formatting bonus (3 pts)
  const bulletStyles = resumeText.match(/^\s*[•\-*▪●]\s/gm) || [];
  const numberedStyles = resumeText.match(/^\s*\d+\.\s/gm) || [];
  if (bulletStyles.length > 0 && numberedStyles.length === 0) {
    formatScore += 3; // Consistent bullet style
  } else if (numberedStyles.length > 0 && bulletStyles.length === 0) {
    formatScore += 3;
  } else if (bulletStyles.length > 0 && numberedStyles.length > 0) {
    formatScore += 1; // Mixed styles
  }

  formatScore = Math.max(0, Math.min(23, formatScore));
  total += formatScore;

  if (formatScore >= 18) {
    feedback.push({
      section: "Formatting & Parsing",
      status: "good",
      msg: `${headersFound}/4 standard headers · clean formatting`,
      details: `ATS-friendly structure detected. ${headersFound} standard section headers found.${redFlags.length ? ` Note: creative header "${redFlags[0]}" found.` : ""} Document appears cleanly formatted for automated parsing.`,
    });
  } else if (formatScore >= 10) {
    feedback.push({
      section: "Formatting & Parsing",
      status: "warning",
      msg: `${headersFound}/4 standard headers${redFlags.length ? " · creative headers detected" : ""}`,
      details: `${missingHeaders.length ? `Missing standard headers: ${missingHeaders.join(", ")}. ` : ""}${redFlags.length ? `Creative header "${redFlags[0]}" may confuse ATS parsers. ` : ""}${hasTableIndicators ? "Table-like formatting detected — ATS may struggle to parse tables. " : ""}Use standard headers (Experience, Education, Skills, Summary) for best results.`,
    });
  } else {
    feedback.push({
      section: "Formatting & Parsing",
      status: "error",
      msg: `Only ${headersFound}/4 standard headers — parsing issues likely`,
      details: `Your resume may not parse correctly in ATS systems. ${missingHeaders.length ? `Add standard headers for: ${missingHeaders.join(", ")}. ` : ""}${specialCharRatio >= 0.05 ? "Excessive special characters detected — simplify formatting. " : ""}${hasTableIndicators ? "Remove tables — ATS systems often can't read them. " : ""}Stick to a simple, single-column layout with standard section names.`,
    });
  }

  // ════════════════════════════════════════════════════════════
  // 3. EXPERIENCE & QUALIFICATION MATCH (22 pts max)
  // ════════════════════════════════════════════════════════════
  let qualScore = 0;

  // Years of experience (up to 10 pts)
  const requiredYears = extractRequiredYears(jdText);
  const resumeYears = estimateResumeYears(resumeText);

  let yearsNote = "";
  if (requiredYears !== null) {
    if (resumeYears >= requiredYears) {
      qualScore += 10;
      yearsNote = `${resumeYears} years detected vs ${requiredYears}+ required — meets requirement`;
    } else if (resumeYears >= requiredYears - 1) {
      qualScore += 7;
      yearsNote = `${resumeYears} years detected vs ${requiredYears}+ required — close match`;
    } else if (resumeYears > 0) {
      qualScore += 3;
      yearsNote = `${resumeYears} years detected vs ${requiredYears}+ required — gap exists`;
    } else {
      yearsNote = `${requiredYears}+ years required but couldn't detect experience duration`;
    }
  } else {
    // No specific years requirement — give partial credit for having experience
    if (resumeYears > 0) {
      qualScore += 6;
      yearsNote = `${resumeYears} years of experience detected`;
    } else {
      qualScore += 3;
      yearsNote = "Could not detect years of experience from date ranges";
    }
  }

  // Education level match (up to 8 pts)
  const resumeEdu = detectEducation(resumeText);
  const jdEdu = detectEducation(jdText);

  let eduNote = "";
  if (jdEdu && resumeEdu) {
    if (resumeEdu.level >= jdEdu.level) {
      qualScore += 8;
      eduNote = "Education level meets or exceeds requirement";
    } else if (resumeEdu.level === jdEdu.level - 1) {
      qualScore += 5;
      eduNote = "Education level is one step below requirement";
    } else {
      qualScore += 2;
      eduNote = "Education level is below requirement";
    }
  } else if (resumeEdu) {
    qualScore += 5;
    eduNote = `${resumeEdu.label} detected — no specific requirement in JD`;
  } else {
    qualScore += 2;
    eduNote = "No education level clearly detected";
  }

  // Certification detection (up to 4 pts)
  const certPatterns = [
    /\b(certified|certification|certificate)\b/i,
    /\bPMP\b/, /\bCPA\b/, /\bCFA\b/, /\bAWS\s+certified/i,
    /\bGoogle\s+certified/i, /\bAzure\s+certified/i,
    /\bCISS?P\b/, /\bScrumMaster\b/i, /\bCSM\b/, /\bSAFe\b/,
    /\bCCNA\b/, /\bCCNP\b/, /\bCompTIA/i,
  ];
  const certCount = certPatterns.filter((p) => p.test(resumeText)).length;
  if (certCount >= 2) {
    qualScore += 4;
  } else if (certCount === 1) {
    qualScore += 2;
  }

  qualScore = Math.min(22, qualScore);
  total += qualScore;

  const certNote = certCount > 0 ? `${certCount} certification(s) detected.` : "";

  if (qualScore >= 17) {
    feedback.push({
      section: "Experience & Qualifications",
      status: "good",
      msg: `${yearsNote.split("—")[0].trim()}`,
      details: `${yearsNote}. ${eduNote}. ${certNote}`.trim(),
    });
  } else if (qualScore >= 10) {
    feedback.push({
      section: "Experience & Qualifications",
      status: "warning",
      msg: `Partial match — ${yearsNote.split("—")[0].trim().toLowerCase()}`,
      details: `${yearsNote}. ${eduNote}. ${certNote} Consider highlighting transferable experience and relevant projects to bridge any gaps.`.trim(),
    });
  } else {
    feedback.push({
      section: "Experience & Qualifications",
      status: "error",
      msg: "Significant qualification gaps detected",
      details: `${yearsNote}. ${eduNote}. ${certNote} Your qualifications may not meet the minimum requirements. Consider emphasizing relevant projects, certifications, or transferable skills.`.trim(),
    });
  }

  // ════════════════════════════════════════════════════════════
  // FINAL SCORE
  // ════════════════════════════════════════════════════════════
  const score = Math.max(0, Math.min(90, total));

  return { score, feedback, missedKeywords: topMissed, density: Math.round(density * 10) / 10 };
}
