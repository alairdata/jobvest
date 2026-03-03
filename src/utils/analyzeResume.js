// ── Power verbs for bullet quality scoring ──
const POWER_VERBS = [
  "achieved", "increased", "reduced", "spearheaded", "developed", "managed",
  "led", "optimized", "delivered", "launched", "built", "designed",
  "implemented", "automated", "streamlined", "negotiated", "generated",
  "improved", "resolved", "created", "orchestrated", "transformed",
  "accelerated", "consolidated", "pioneered", "revamped", "mentored",
  "secured", "expanded", "established", "facilitated", "coordinated",
  "analyzed", "engineered", "integrated", "migrated", "deployed",
  "architected", "scaled", "executed",
];

// ── Standard section headers ──
const STANDARD_HEADERS = {
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

// ── Common resume misspellings: wrong → correct ──
const COMMON_TYPOS = {
  recieved: "received", managment: "management", acheived: "achieved",
  liason: "liaison", seperate: "separate", occured: "occurred",
  occurence: "occurrence", accomodate: "accommodate", aquire: "acquire",
  aquisition: "acquisition", assesment: "assessment", beleive: "believe",
  calender: "calendar", catagory: "category", collabarate: "collaborate",
  comittee: "committee", commited: "committed", comptetive: "competitive",
  concensus: "consensus", consistant: "consistent", corordinate: "coordinate",
  curriculm: "curriculum", definately: "definitely", dependant: "dependent",
  develope: "develop", diligant: "diligent", enviroment: "environment",
  excercise: "exercise", existance: "existence", experiance: "experience",
  facillitate: "facilitate", foriegn: "foreign", goverment: "government",
  guidence: "guidance", harrass: "harass", immediatly: "immediately",
  independant: "independent", indispensible: "indispensable", knowlege: "knowledge",
  maintainance: "maintenance", millenial: "millennial", mispell: "misspell",
  neccessary: "necessary", negociate: "negotiate", noticable: "noticeable",
  occassion: "occasion", oppurtunity: "opportunity", parliment: "parliament",
  persistant: "persistent", personnell: "personnel", posession: "possession",
  prevelant: "prevalent", privelege: "privilege", proffessional: "professional",
  proficiant: "proficient", programing: "programming", publically: "publicly",
  recomend: "recommend", refered: "referred", relevent: "relevant",
  responsibilty: "responsibility", restaraunt: "restaurant", sciense: "science",
  succesful: "successful", supercede: "supersede", surveilance: "surveillance",
  techinal: "technical", technolgy: "technology", threshhold: "threshold",
  transfered: "transferred", unforunately: "unfortunately", untill: "until",
  usualy: "usually", vaccuum: "vacuum", withold: "withhold", writting: "writing",
  acheive: "achieve", adress: "address", agressive: "aggressive",
  aledge: "allege", amature: "amateur", apparant: "apparent",
  begining: "beginning", buisness: "business", carrieer: "career",
  chalenging: "challenging", colum: "column", comunicate: "communicate",
  consciencious: "conscientious", critisism: "criticism", decison: "decision",
  desireable: "desirable", dissapoint: "disappoint", effeciency: "efficiency",
  embarass: "embarrass", enterpreneur: "entrepreneur", equiptment: "equipment",
  exagerate: "exaggerate", excellant: "excellent", familar: "familiar",
  feasability: "feasibility", flourescent: "fluorescent", fullfill: "fulfill",
  garauntee: "guarantee", grammer: "grammar", heirarchy: "hierarchy",
  hygeine: "hygiene", identfy: "identify", inadvertant: "inadvertent",
  inovation: "innovation", inteligence: "intelligence", jeopardise: "jeopardize",
  judgement: "judgment", knowledgable: "knowledgeable", liesure: "leisure",
  lenght: "length", liberry: "library", lisence: "license",
  logistcs: "logistics", manuever: "maneuver", mileu: "milieu",
  miniscule: "minuscule", moniter: "monitor", morgage: "mortgage",
  neigbor: "neighbor", obediant: "obedient", paralel: "parallel",
  pasttime: "pastime", percieve: "perceive", performence: "performance",
  permissable: "permissible", perseverence: "perseverance", plagerism: "plagiarism",
  preceed: "precede", presance: "presence", principel: "principal",
  proceedure: "procedure", pronouciation: "pronunciation", questionaire: "questionnaire",
  reaccuring: "recurring", reciept: "receipt", recognise: "recognize",
  rediculous: "ridiculous", refference: "reference", reguardless: "regardless",
  remberance: "remembrance", repitition: "repetition", resourse: "resource",
  rythm: "rhythm", sacrafice: "sacrifice", saftey: "safety",
  seize: "seize", sentance: "sentence", significent: "significant",
  similer: "similar", sinceerly: "sincerely", sophistacated: "sophisticated",
  specificaly: "specifically", strenght: "strength", sturcture: "structure",
  subsidary: "subsidiary", sucess: "success", suficient: "sufficient",
  sylabus: "syllabus", symetrical: "symmetrical", technicaly: "technically",
  temperture: "temperature", therefor: "therefore", thorogh: "thorough",
  tommorow: "tomorrow", tounge: "tongue", transferrable: "transferable",
  truely: "truly", twelth: "twelfth", tyrany: "tyranny",
  unecessary: "unnecessary", unfortunatly: "unfortunately", uniuqe: "unique",
  useable: "usable", utilise: "utilise", vaccinate: "vaccinate",
  vegitable: "vegetable", villian: "villain", visable: "visible",
  wether: "whether", wierd: "weird", yeild: "yield",
};

// ── Role-to-Skills Map for relevance scoring ──
const ROLE_SKILL_MAP = {
  "data scientist": ["python", "sql", "r", "tableau", "power bi", "excel", "statistics", "machine learning", "pandas", "numpy", "tensorflow", "pytorch"],
  "data analyst": ["python", "sql", "r", "tableau", "power bi", "excel", "statistics", "machine learning", "pandas", "numpy", "tensorflow", "pytorch"],
  "product manager": ["roadmap", "agile", "jira", "analytics", "a/b testing", "stakeholder", "user research", "sql"],
  "product owner": ["roadmap", "agile", "jira", "analytics", "a/b testing", "stakeholder", "user research", "sql"],
  "project manager": ["agile", "scrum", "jira", "confluence", "stakeholder", "budgeting", "roadmap", "leadership", "ms project"],
  "software": ["javascript", "typescript", "python", "react", "node", "git", "sql", "aws", "docker", "api", "rest", "ci/cd", "agile"],
  "developer": ["javascript", "typescript", "python", "react", "node", "git", "sql", "aws", "docker", "api", "rest", "ci/cd", "agile"],
  "engineer": ["javascript", "typescript", "python", "react", "node", "git", "sql", "aws", "docker", "api", "rest", "ci/cd", "agile"],
  "designer": ["figma", "sketch", "adobe", "css", "html", "prototyping", "wireframing", "user research", "accessibility"],
  "ux": ["figma", "sketch", "adobe", "css", "html", "prototyping", "wireframing", "user research", "accessibility"],
  "ui": ["figma", "sketch", "adobe", "css", "html", "prototyping", "wireframing", "user research", "accessibility"],
  "marketing": ["google analytics", "seo", "social media", "hubspot", "mailchimp", "copywriting", "crm", "excel", "ads", "content strategy"],
  "seo": ["google analytics", "seo", "social media", "hubspot", "mailchimp", "copywriting", "crm", "excel", "ads", "content strategy"],
  "content": ["google analytics", "seo", "social media", "hubspot", "mailchimp", "copywriting", "crm", "excel", "ads", "content strategy"],
  "manager": ["agile", "scrum", "jira", "confluence", "stakeholder", "budgeting", "roadmap", "leadership", "ms project"],
  "scrum": ["agile", "scrum", "jira", "confluence", "stakeholder", "budgeting", "roadmap", "leadership", "ms project"],
  "devops": ["docker", "kubernetes", "terraform", "aws", "gcp", "azure", "ci/cd", "linux", "ansible", "monitoring", "jenkins"],
  "sre": ["docker", "kubernetes", "terraform", "aws", "gcp", "azure", "ci/cd", "linux", "ansible", "monitoring", "jenkins"],
  "infrastructure": ["docker", "kubernetes", "terraform", "aws", "gcp", "azure", "ci/cd", "linux", "ansible", "monitoring", "jenkins"],
  "accountant": ["excel", "quickbooks", "sap", "financial modeling", "gaap", "auditing", "forecasting", "compliance"],
  "finance": ["excel", "quickbooks", "sap", "financial modeling", "gaap", "auditing", "forecasting", "compliance"],
  "banking": ["excel", "quickbooks", "sap", "financial modeling", "gaap", "auditing", "forecasting", "compliance"],
  "nurse": ["patient care", "ehr", "hipaa", "clinical", "cpr", "medical terminology"],
  "doctor": ["patient care", "ehr", "hipaa", "clinical", "cpr", "medical terminology"],
  "healthcare": ["patient care", "ehr", "hipaa", "clinical", "cpr", "medical terminology"],
  "teacher": ["curriculum", "lesson planning", "assessment", "classroom management", "lms"],
  "education": ["curriculum", "lesson planning", "assessment", "classroom management", "lms"],
  "instructor": ["curriculum", "lesson planning", "assessment", "classroom management", "lms"],
  "analytics": ["python", "sql", "r", "tableau", "power bi", "excel", "statistics", "machine learning", "pandas", "numpy", "tensorflow", "pytorch"],
};

// Keys sorted: multi-word first, then single-word, for correct matching priority
const ROLE_KEYS_SORTED = Object.keys(ROLE_SKILL_MAP).sort((a, b) => {
  const aWords = a.split(/\s+/).length;
  const bWords = b.split(/\s+/).length;
  return bWords - aWords; // multi-word keys first
});

/**
 * Detect role from text by matching against ROLE_SKILL_MAP keys.
 * Returns { role: string, skills: string[] } or null if no match.
 */
function detectRole(text) {
  const t = text.toLowerCase();
  for (const key of ROLE_KEYS_SORTED) {
    if (t.includes(key)) {
      return { role: key, skills: ROLE_SKILL_MAP[key] };
    }
  }
  return null;
}

/**
 * Estimate total years of experience from date ranges in resume text.
 * Looks for patterns like "2018 - 2022", "Jan 2019 - Present", "2015 - current".
 * Returns the span from earliest year to latest year, or 0 if none found.
 */
function estimateExperienceYears(text) {
  const currentYear = new Date().getFullYear();
  const dateRangePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})\s*[-–—to]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2}|present|current|now|ongoing)/gi;
  let earliest = Infinity;
  let latest = 0;
  let match;
  while ((match = dateRangePattern.exec(text)) !== null) {
    const startYear = parseInt(match[1], 10);
    const endRaw = match[2].toLowerCase();
    const endYear = /present|current|now|ongoing/.test(endRaw) ? currentYear : parseInt(endRaw, 10);
    if (startYear >= 1970 && startYear <= currentYear && endYear >= startYear && endYear <= currentYear) {
      if (startYear < earliest) earliest = startYear;
      if (endYear > latest) latest = endYear;
    }
  }
  return latest > 0 ? latest - earliest : 0;
}

// ── Section headers used for boundary detection ──
const ALL_SECTION_HEADERS = [
  ...STANDARD_HEADERS.experience,
  ...STANDARD_HEADERS.education,
  ...STANDARD_HEADERS.skills,
  ...STANDARD_HEADERS.summary,
  "certifications", "projects", "references", "awards", "publications",
  "volunteer", "languages", "interests", "affiliations", "training",
];

/**
 * Extract only the Work History section text from the resume.
 * Finds start via workAliases, finds end at the next major section header.
 */
function extractWorkSection(text) {
  const workAliases = ["professional experience", "work experience", "work history", "employment history", "employment", "experience"];
  let startIdx = -1;
  let matchedAlias = "";

  // Match only section headers (start of line, followed by newline/colon/end)
  // Try multi-word aliases first (more specific) before single-word ones
  for (const alias of workAliases) {
    const headerRegex = new RegExp(`(^|\\n)\\s*${alias}\\s*(\\n|:|$)`, "im");
    const match = headerRegex.exec(text);
    if (match) {
      const idx = match.index + match[1].length;
      if (startIdx === -1 || idx < startIdx) {
        startIdx = idx;
        matchedAlias = alias;
      }
    }
  }

  if (startIdx === -1) return "";

  // Move past the header line
  const afterHeader = startIdx + matchedAlias.length;
  const nextNewline = text.indexOf("\n", afterHeader);
  const contentStart = nextNewline !== -1 ? nextNewline + 1 : afterHeader;

  // Find the next section header to mark the end
  const nonWorkHeaders = ALL_SECTION_HEADERS.filter(
    (h) => !workAliases.includes(h) && h !== "experience"
  );

  let endIdx = text.length;
  for (const header of nonWorkHeaders) {
    const headerRegex = new RegExp(`(^|\\n)\\s*${header}\\s*(\\n|:|$)`, "im");
    const match = headerRegex.exec(text.slice(contentStart));
    if (match) {
      const pos = contentStart + match.index;
      if (pos < endIdx) endIdx = pos;
    }
  }

  return text.slice(contentStart, endIdx).trim();
}

/**
 * Parse the work section into individual job entries.
 * Each entry: { title, startYear, endYear, bullets, isCurrentRole }
 */
function parseJobEntries(workSectionText) {
  if (!workSectionText) return [];

  const currentYear = new Date().getFullYear();
  const dateRangePattern = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})\s*[-–—to]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2}|present|current|now|ongoing)/gi;

  const lines = workSectionText.split(/\n/);
  const jobMarkers = []; // { lineIndex, startYear, endYear, isCurrentRole }

  for (let i = 0; i < lines.length; i++) {
    dateRangePattern.lastIndex = 0;
    const match = dateRangePattern.exec(lines[i]);
    if (match) {
      const startYear = parseInt(match[1], 10);
      const endRaw = match[2].toLowerCase();
      const isCurrentRole = /present|current|now|ongoing/.test(endRaw);
      const endYear = isCurrentRole ? currentYear : parseInt(endRaw, 10);
      if (startYear >= 1970 && startYear <= currentYear && endYear >= startYear && endYear <= currentYear) {
        // Title is typically on the same line or the line before the date
        let title = lines[i].replace(dateRangePattern, "").replace(/[|,•\-–—]/g, " ").trim();
        if (!title && i > 0) {
          title = lines[i - 1].replace(/[|,•\-–—]/g, " ").trim();
        }
        jobMarkers.push({ lineIndex: i, startYear, endYear, isCurrentRole, title: title || "Untitled Role" });
      }
    }
  }

  if (jobMarkers.length === 0) return [];

  // Split lines into blocks per job
  const entries = [];
  for (let j = 0; j < jobMarkers.length; j++) {
    const start = jobMarkers[j].lineIndex + 1;
    const end = j + 1 < jobMarkers.length ? jobMarkers[j + 1].lineIndex : lines.length;
    // Also check the line before for title (might include title line above date)
    const blockStart = (jobMarkers[j].lineIndex > 0 && j === 0) ? jobMarkers[j].lineIndex : jobMarkers[j].lineIndex;
    const blockLines = lines.slice(start, end);
    const bullets = blockLines.filter((l) => /^\s*[•\-*▪●]\s/.test(l) || /^\s*\d+\.\s/.test(l));

    entries.push({
      title: jobMarkers[j].title,
      startYear: jobMarkers[j].startYear,
      endYear: jobMarkers[j].endYear,
      isCurrentRole: jobMarkers[j].isCurrentRole,
      bullets,
    });
  }

  return entries;
}

/**
 * Categorize job entries by recency: current/recent, mid-career, older.
 */
function categorizeByRecency(jobEntries) {
  const currentYear = new Date().getFullYear();
  const current = [];
  const mid = [];
  const older = [];

  for (const entry of jobEntries) {
    if (entry.endYear >= currentYear - 1) {
      current.push(entry);
    } else if (entry.endYear >= currentYear - 5) {
      mid.push(entry);
    } else {
      older.push(entry);
    }
  }

  return { current, mid, older };
}

/**
 * Analyze extracted resume text across 9 categories (totaling 100 pts).
 * Returns { score: number, feedback: Array<{section, status, msg, details}> }
 */
export function analyzeResume(text, pageCount = 1) {
  const lower = text.toLowerCase();
  const feedback = [];
  let total = 0;

  // ── 1. Contact Info (10 pts) ──
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  const hasEmail = !!emailMatch;
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);
  const hasGitHub = /github\.com/i.test(text);
  const contactHits = [hasEmail, hasPhone, hasLinkedIn || hasGitHub].filter(Boolean).length;

  // Email quality checks
  const emailFlags = [];
  if (hasEmail) {
    const email = emailMatch[0].toLowerCase();
    const localPart = email.split("@")[0];
    const domain = email.split("@")[1];

    // Unprofessional / silly handles
    const casualPatterns = /^(party|sexy|hot|babe|cool|crazy|drunk|gamer|ninja|pimp|swag|thug|420|69|xxx|killer|angel|devil|princess|queen|king\d|baby|cutie|love|fun)/;
    if (casualPatterns.test(localPart)) {
      emailFlags.push("Your email handle looks unprofessional — recruiters judge this. Use firstname.lastname@provider.com");
    }

    // Excessive numbers (e.g., john38291@...)
    const digitCount = (localPart.match(/\d/g) || []).length;
    if (digitCount >= 4) {
      emailFlags.push("Too many numbers in your email handle — it looks auto-generated. Use a cleaner format like firstname.lastname");
    }

    // Outdated domains
    const outdatedDomains = ["aol.com", "hotmail.com", "yahoo.com", "msn.com", "earthlink.net", "juno.com", "comcast.net", "sbcglobal.net", "att.net", "bellsouth.net"];
    if (outdatedDomains.some((d) => domain === d || domain.endsWith("." + d))) {
      emailFlags.push(`"@${domain}" can signal tech-lag to recruiters — consider switching to Gmail or a custom domain`);
    }

    // Work / corporate email
    const personalDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "me.com", "protonmail.com", "proton.me", "aol.com", "msn.com", "live.com", "mail.com", "zoho.com", "yandex.com", "gmx.com", "fastmail.com"];
    const isEduDomain = /\.(edu|ac\.\w+)$/i.test(domain);
    const isPersonalOrEdu = personalDomains.includes(domain) || isEduDomain;
    if (!isPersonalOrEdu && !emailFlags.length) {
      emailFlags.push(`"@${domain}" looks like a work email — never use your employer's email on a resume. Use a personal email instead`);
    }
  }

  // Scoring: base points for fields present, then deduct for email red flags
  if (contactHits === 3 && emailFlags.length === 0) {
    total += 10;
    feedback.push({ section: "Contact Information", status: "good", msg: "All key fields present and professional", details: "Email, phone, and profile link (LinkedIn/GitHub) detected. Your email looks professional. No changes needed." });
  } else if (contactHits === 3 && emailFlags.length > 0) {
    total += 7;
    feedback.push({ section: "Contact Information", status: "warning", msg: "All fields present but email needs attention", details: `All 3 contact fields detected, but: ${emailFlags.join(". ")}.` });
  } else if (contactHits >= 1) {
    total += emailFlags.length > 0 ? 3 : 5;
    const missing = [];
    if (!hasEmail) missing.push("email");
    if (!hasPhone) missing.push("phone number");
    if (!hasLinkedIn && !hasGitHub) missing.push("LinkedIn or GitHub URL");
    const emailWarning = emailFlags.length > 0 ? ` Also: ${emailFlags.join(". ")}.` : "";
    feedback.push({ section: "Contact Information", status: "warning", msg: `Missing: ${missing.join(", ")}${emailFlags.length ? " · email red flag" : ""}`, details: `We found ${contactHits}/3 expected contact fields. Add ${missing.join(" and ")} so recruiters can easily reach you.${emailWarning}` });
  } else {
    feedback.push({ section: "Contact Information", status: "error", msg: "No contact information detected", details: "We couldn't find an email, phone number, or profile link. Make sure they are present in plain text (not embedded in images)." });
  }

  // ── 2. Professional Summary (12 pts) ──
  const summaryLabels = ["professional summary", "summary", "profile", "about me"];
  const objectiveLabels = ["career objective", "objective"];
  const summaryAliases = [...summaryLabels, ...objectiveLabels];
  const hasSummarySection = summaryAliases.some((a) => lower.includes(a));
  const isObjectiveHeading = !summaryLabels.some((a) => lower.includes(a)) && objectiveLabels.some((a) => lower.includes(a));
  let summaryText = "";
  if (hasSummarySection) {
    for (const alias of summaryAliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) {
        summaryText = text.slice(idx, idx + 500);
        break;
      }
    }
  }
  const summaryWordCount = summaryText.split(/\s+/).filter(Boolean).length;
  const roleTerms = ["engineer", "developer", "analyst", "manager", "designer", "scientist", "consultant", "specialist", "lead", "architect", "coordinator"];
  const hasRoleTerms = roleTerms.some((t) => lower.includes(t));

  if (isObjectiveHeading) {
    total += 5;
    feedback.push({ section: "Professional Summary", status: "warning", msg: "\"Objective\" statements are outdated — switch to a Professional Summary", details: "Objective sections (e.g. 'I want a job where...') are considered outdated by most recruiters. Replace with a 'Professional Summary' that highlights your value proposition in 3-5 sentences. Capped at 5/12 pts." });
  } else if (hasSummarySection && summaryWordCount > 30 && hasRoleTerms) {
    total += 12;
    feedback.push({ section: "Professional Summary", status: "good", msg: "Strong summary with role-specific language", details: "Your summary is a good length and contains relevant role keywords. Nice work." });
  } else if (hasSummarySection) {
    total += 6;
    const issues = [];
    if (summaryWordCount <= 30) issues.push("it's too short (aim for 3-5 sentences)");
    if (!hasRoleTerms) issues.push("it lacks role-specific terms");
    feedback.push({ section: "Professional Summary", status: "warning", msg: `Summary present but ${issues.join(" and ")}`, details: "Add specific terms that mirror what hiring managers look for, and expand to 3-5 impactful sentences." });
  } else {
    feedback.push({ section: "Professional Summary", status: "error", msg: "No summary or objective section found", details: "Add a 'Professional Summary' section at the top with 3-5 sentences highlighting your value proposition and key strengths." });
  }

  // ── 3. Skills (12 pts) ──
  const skillAliases = ["skills", "technical skills", "core competencies", "technologies", "tools"];
  const hasSkillSection = skillAliases.some((a) => lower.includes(a));
  let skillsText = "";
  if (hasSkillSection) {
    for (const alias of skillAliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) {
        skillsText = text.slice(idx, idx + 600);
        break;
      }
    }
  }
  const skillTokens = skillsText
    .split(/[,|;•·●▪–—\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40);
  const skillCount = skillTokens.length;

  const trendingKeywords = ["python", "javascript", "typescript", "react", "node", "aws", "docker", "kubernetes", "sql", "terraform", "gcp", "azure", "tensorflow", "pytorch", "figma", "tableau", "power bi", "git", "ci/cd", "agile"];
  const foundTrending = trendingKeywords.filter((k) => lower.includes(k));

  // Detect candidate role from summary and full text
  const detectedRole = detectRole(summaryText) || detectRole(lower);

  if (!hasSkillSection) {
    feedback.push({ section: "Skills", status: "error", msg: "No skills section detected", details: "Add a 'Skills' section listing at least 8 relevant technical and soft skills. Use comma-separated or bulleted format for ATS compatibility." });
  } else if (skillCount < 4) {
    total += 3;
    feedback.push({ section: "Skills", status: "warning", msg: "Skills section found but very few skills listed", details: "Expand your skills list to at least 8 items. Include a mix of technical tools, frameworks, and soft skills relevant to your target role." });
  } else if (detectedRole) {
    // Role-aware relevance scoring
    const skillTokensLower = skillTokens.map((s) => s.toLowerCase());
    const relevantCount = skillTokensLower.filter((s) => detectedRole.skills.some((expected) => s.includes(expected) || expected.includes(s))).length;
    const relevancePct = relevantCount / skillTokens.length;
    const matchedSkills = detectedRole.skills.filter((expected) => skillTokensLower.some((s) => s.includes(expected) || expected.includes(s)));
    const missingSkills = detectedRole.skills.filter((expected) => !skillTokensLower.some((s) => s.includes(expected) || expected.includes(s))).slice(0, 5);

    if (skillCount >= 8 && relevancePct >= 0.4) {
      total += 12;
      feedback.push({ section: "Skills", status: "good", msg: `${skillCount} skills detected, well-aligned with ${detectedRole.role} (incl. ${matchedSkills.slice(0, 4).join(", ")})`, details: `Good variety of skills listed and ${relevantCount} are relevant to your detected role. Consider grouping them into categories (Languages, Frameworks, Tools) for even better readability.` });
    } else if (skillCount >= 8) {
      total += 9;
      feedback.push({ section: "Skills", status: "warning", msg: `${skillCount} skills listed but only ${relevantCount} match typical ${detectedRole.role} skills`, details: `Good number of skills but many aren't relevant to ${detectedRole.role}. Consider adding: ${missingSkills.join(", ")}.` });
    } else if (relevancePct >= 0.4) {
      total += 8;
      feedback.push({ section: "Skills", status: "warning", msg: `Only ${skillCount} skills found but they're relevant to ${detectedRole.role}`, details: `Skills are relevant but you need more — aim for 8+. Add more: ${missingSkills.join(", ")}.` });
    } else {
      total += 5;
      feedback.push({ section: "Skills", status: "warning", msg: `Only ${skillCount} skills and not well-tailored to ${detectedRole.role}`, details: `Few skills and not well-tailored to your detected role. Consider adding: ${missingSkills.join(", ")}.` });
    }
  } else {
    // No role detected — fall back to count-only scoring
    if (skillCount >= 8) {
      total += 12;
      feedback.push({ section: "Skills", status: "good", msg: `${skillCount} skills detected${foundTrending.length ? ` incl. trending: ${foundTrending.slice(0, 4).join(", ")}` : ""}`, details: "Good variety of skills listed. Consider grouping them into categories (Languages, Frameworks, Tools) for even better readability." });
    } else {
      total += 7;
      feedback.push({ section: "Skills", status: "warning", msg: `Only ${skillCount} skills found — aim for 8+`, details: `Add more relevant skills.${foundTrending.length === 0 ? " Include trending tools like Python, React, AWS, Docker, or Figma depending on your field." : ""}` });
    }
  }

  // ── 4. Work History (14 pts) ──
  const workAliases = ["experience", "work history", "employment", "professional experience", "work experience"];
  const hasWorkSection = workAliases.some((a) => lower.includes(a));

  // Extract work section and parse per-role job entries
  const workSectionText = extractWorkSection(text);
  const jobEntries = parseJobEntries(workSectionText);
  const hasJobEntries = jobEntries.length > 0;

  // Collect all bullets from the work section (for section 6 too)
  const workSectionBullets = workSectionText
    ? workSectionText.split(/\n/).filter((l) => /^\s*[•\-*▪●]\s/.test(l) || /^\s*\d+\.\s/.test(l))
    : [];
  // Fallback: global bullets if work section extraction fails
  const bullets = workSectionBullets.length > 0
    ? workSectionBullets
    : text.split(/\n/).filter((l) => /^\s*[•\-*▪●]\s/.test(l) || /^\s*\d+\.\s/.test(l));
  const bulletCount = bullets.length;
  const quantifiedBulletRegex = /\d+%|\$[\d,.]+[KkMmBb]?|\b\d{1,3}(,\d{3})+\b|\b\d+[KkMmBb]\b|\b(increased|decreased|reduced|improved|grew|boosted|cut|saved|generated|raised|lowered|expanded|shrank|doubled|tripled).*\b\d+\b|\b\d+\s*(users|clients|customers|employees|projects|teams|members|accounts|servers|applications|reports|tickets|endpoints|pages|records|transactions|locations|stores|units)/i;
  const quantifiedBullets = bullets.filter((b) => quantifiedBulletRegex.test(b));

  if (!hasWorkSection) {
    feedback.push({ section: "Work History", status: "error", msg: "No work experience section detected", details: "Add a 'Work Experience' section listing your roles with bullet-point achievements. Even internships or freelance work count." });
  } else if (hasJobEntries) {
    // ── Per-role analysis ──
    const { current, mid, older } = categorizeByRecency(jobEntries);
    const workDetails = [];

    // Base score from existing tier logic
    let workScore;
    if (bulletCount >= 6 && quantifiedBullets.length >= 3) {
      workScore = 14;
    } else if (bulletCount >= 3) {
      workScore = 8;
    } else {
      workScore = 4;
    }

    // Per-role checks
    let glazeOver = false;
    let underdeveloped = false;
    const wordyBullets = [];

    for (const entry of jobEntries) {
      const dateLabel = entry.isCurrentRole
        ? `${entry.startYear}-Present`
        : `${entry.startYear}-${entry.endYear}`;
      const label = `${entry.title} (${dateLabel})`;

      // Glaze-over: >8 bullets in one role
      if (entry.bullets.length > 8) {
        glazeOver = true;
        const category = current.includes(entry) ? "current/recent" : mid.includes(entry) ? "mid-career" : "older";
        const target = category === "older" ? "1-3" : category === "mid-career" ? "3-5" : "5-8";
        workDetails.push(`${label} has ${entry.bullets.length} bullets — trim to ${target} for readability`);
      }

      // Underdeveloped: recent/mid role with <2 bullets
      if (!older.includes(entry) && entry.bullets.length < 2) {
        underdeveloped = true;
        workDetails.push(`${label} has only ${entry.bullets.length} bullet${entry.bullets.length === 1 ? "" : "s"} — add 2-4 more to show impact`);
      }

      // Wordy bullets: >200 chars
      for (const b of entry.bullets) {
        if (b.trim().length > 200) wordyBullets.push(b);
      }
    }

    // Apply penalties
    if (glazeOver) workScore = Math.max(workScore - 1, 0);
    if (underdeveloped) workScore = Math.max(workScore - 1, 0);
    if (bulletCount > 0 && wordyBullets.length / bulletCount > 0.25) {
      workScore = Math.max(workScore - 1, 0);
      workDetails.push(`${wordyBullets.length} bullet${wordyBullets.length === 1 ? "" : "s"} exceed${wordyBullets.length === 1 ? "s" : ""} 200 characters — keep each to 1-2 lines`);
    }

    // Reverse-chronological order check: most recent job should come first
    if (jobEntries.length >= 2) {
      let outOfOrder = false;
      for (let i = 1; i < jobEntries.length; i++) {
        if (jobEntries[i].endYear > jobEntries[i - 1].endYear) {
          outOfOrder = true;
          break;
        }
      }
      if (outOfOrder) {
        workScore = Math.max(workScore - 1, 0);
        workDetails.push("Jobs are not in reverse-chronological order — list your most recent role first");
      }
    }

    workScore = Math.min(workScore, 14);
    workScore = Math.max(workScore, 0);
    total += workScore;

    // Build feedback
    const baseMsg = `${bulletCount} bullets across ${jobEntries.length} role${jobEntries.length > 1 ? "s" : ""}, ${quantifiedBullets.length} with quantified results`;
    const penalties = [glazeOver && "wall-of-text role", underdeveloped && "underdeveloped role", wordyBullets.length / bulletCount > 0.25 && "wordy bullets"].filter(Boolean);
    const status = workScore >= 12 ? "good" : workScore >= 6 ? "warning" : "error";
    const penaltyNote = penalties.length ? ` Deductions: ${penalties.join(", ")}.` : "";
    const detailStr = workDetails.length
      ? workDetails.join(". ") + "."
      : "Great use of the X-Y-Z formula with measurable achievements.";

    feedback.push({ section: "Work History", status, msg: baseMsg, details: `${detailStr}${penaltyNote}` });
  } else {
    // ── No date ranges found — deduct 2 pts and flag as improvement ──
    let workScore;
    if (bulletCount >= 6 && quantifiedBullets.length >= 3) {
      workScore = 14;
    } else if (bulletCount >= 3) {
      workScore = 8;
    } else {
      workScore = 4;
    }

    workScore = Math.max(workScore - 2, 0);
    total += workScore;

    const tips = [];
    tips.push("Add clear start/end dates for each role (e.g. 'Jan 2020 - Present') — recruiters expect this");
    if (quantifiedBullets.length === 0) {
      tips.push("None of your bullets include numbers or percentages — use the X-Y-Z formula: 'Accomplished [X] as measured by [Y] by doing [Z]'");
    } else if (quantifiedBullets.length < 3) {
      tips.push(`Only ${quantifiedBullets.length} bullet(s) include metrics — aim for at least 3 quantified achievements`);
    }

    feedback.push({
      section: "Work History",
      status: workScore >= 6 ? "warning" : "error",
      msg: `${bulletCount} bullets found, no date ranges detected (-2 pts)`,
      details: `Things to improve: ${tips.join(". ")}.`,
    });
  }

  // ── 5. Education (10 pts) ──
  const eduAliases = ["education", "academic", "degree", "university", "college"];
  const hasEduSection = eduAliases.some((a) => lower.includes(a));
  const degreeTerms = ["bachelor", "master", "b.s.", "b.a.", "m.s.", "m.a.", "ph.d", "mba", "associate", "diploma", "b.sc", "m.sc", "b.eng", "m.eng"];
  const hasDegree = degreeTerms.some((d) => lower.includes(d));
  const hasCoursework = /coursework|relevant courses|gpa|cum laude|honors|dean.*list/i.test(text);

  if (hasEduSection && hasDegree && hasCoursework) {
    total += 10;
    feedback.push({ section: "Education", status: "good", msg: "Degree and supporting details present", details: "Education section includes degree, and additional details like coursework, GPA, or honors. Looks great." });
  } else if (hasEduSection && hasDegree) {
    total += 7;
    feedback.push({ section: "Education", status: "warning", msg: "Degree found — consider adding coursework or GPA", details: "Add relevant coursework, GPA (if 3.5+), or honors to strengthen this section and improve keyword matches." });
  } else if (hasEduSection) {
    total += 4;
    feedback.push({ section: "Education", status: "warning", msg: "Education section found but no degree detected", details: "Make sure your degree (e.g. 'Bachelor of Science') is spelled out clearly. Add graduation year and institution." });
  } else {
    feedback.push({ section: "Education", status: "error", msg: "No education section detected", details: "Add an 'Education' section with your degree, institution, and graduation year. Include relevant coursework if you're early-career." });
  }

  // ── 6. Bullet Quality (14 pts) ──
  const bulletLines = bullets.map((b) => b.replace(/^\s*[•\-*▪●\d.]\s*/, "").toLowerCase());
  let strongCount = 0;
  let decentCount = 0;

  for (const line of bulletLines) {
    const firstWord = line.split(/\s+/)[0] || "";
    const hasVerb = POWER_VERBS.some((v) => firstWord === v);
    const hasMetric = /\d+%|\$[\d,.]+[KkMmBb]?|\b\d{1,3}(,\d{3})+\b|\b\d+[KkMmBb]\b/.test(line);
    if (hasVerb && hasMetric) strongCount++;
    else if (hasVerb || hasMetric) decentCount++;
  }

  const totalBullets = bulletLines.length;
  const strongPct = totalBullets > 0 ? strongCount / totalBullets : 0;

  if (totalBullets === 0) {
    feedback.push({ section: "Bullet Quality", status: "error", msg: "No bullet points found to evaluate", details: "Add bullet points under your work experience using action verbs and measurable results. Example: 'Increased sales by 25% by redesigning the onboarding funnel.'" });
  } else if (strongPct >= 0.6) {
    total += 14;
    feedback.push({ section: "Bullet Quality", status: "good", msg: `${strongCount} of ${totalBullets} bullets use the action-verb + metric formula`, details: "Excellent bullet quality. Your accomplishments are clearly quantified and action-driven." });
  } else if (strongPct >= 0.4) {
    total += 9;
    feedback.push({ section: "Bullet Quality", status: "warning", msg: `${strongCount} of ${totalBullets} bullets use the action-verb + metric formula`, details: "Good start, but aim for 60%+ of bullets to combine a power verb with a measurable result. Revise weaker bullets to include numbers or percentages." });
  } else if (strongPct >= 0.2) {
    total += 5;
    feedback.push({ section: "Bullet Quality", status: "warning", msg: `Only ${strongCount} of ${totalBullets} bullets use the action-verb + metric formula`, details: "Most bullets read like duty lists. Rewrite them using the formula: '[Action verb] + [what you did] + [measurable result].' Example: 'Streamlined deployment process, reducing release time by 40%.'" });
  } else {
    feedback.push({ section: "Bullet Quality", status: "error", msg: `${strongCount} of ${totalBullets} bullets use the action-verb + metric formula`, details: "Almost none of your bullets combine action verbs with metrics. Recruiters scan for quantified achievements — rewrite each bullet to start with a power verb and include a number or percentage." });
  }

  // Parallelism check: verb-start vs noun/article-start consistency
  if (totalBullets >= 3) {
    const nounArticlePattern = /^(the|a|an|my|our|leadership|management|responsible|tasked|duties|involvement)\b/i;
    let verbStartCount = 0;
    let nounStartCount = 0;
    for (const line of bulletLines) {
      const firstWord = line.split(/\s+/)[0] || "";
      if (POWER_VERBS.some((v) => firstWord === v)) {
        verbStartCount++;
      } else if (nounArticlePattern.test(line)) {
        nounStartCount++;
      }
    }
    const classified = verbStartCount + nounStartCount;
    if (classified > 0 && nounStartCount / classified > 0.3) {
      const lastBulletFeedback = feedback[feedback.length - 1];
      lastBulletFeedback.details += " Inconsistent bullet style — start all bullets with action verbs for parallelism.";
    }
  }

  // ── 7. Formatting (10 pts) ──
  let standardFound = 0;
  const foundStandard = [];
  const missingStandard = [];

  for (const [category, aliases] of Object.entries(STANDARD_HEADERS)) {
    const found = aliases.some((alias) => {
      const regex = new RegExp(`(^|\\n)\\s*${alias}\\s*(\\n|:|$)`, "im");
      return regex.test(text) || lower.includes(alias);
    });
    if (found) {
      standardFound++;
      foundStandard.push(category);
    } else {
      missingStandard.push(category);
    }
  }

  const redFlagsFound = RED_FLAG_HEADERS.filter((h) => lower.includes(h));

  let formattingScore = 0;
  if (standardFound === 4) {
    formattingScore = 10;
    const extra = redFlagsFound.length ? ` Note: creative header "${redFlagsFound[0]}" found — consider renaming for ATS.` : "";
    feedback.push({ section: "Formatting", status: "good", msg: "All 4 standard section headers found", details: `Your resume uses standard, ATS-friendly headers for Experience, Education, Skills, and Summary.${extra}` });
  } else if (standardFound === 3) {
    formattingScore = 7;
    feedback.push({ section: "Formatting", status: "warning", msg: `3/4 standard headers found — missing: ${missingStandard.join(", ")}`, details: `Use standard headers like "Work Experience," "Education," "Skills," and "Professional Summary" for maximum ATS compatibility.${redFlagsFound.length ? ` Creative header "${redFlagsFound[0]}" may confuse parsers.` : ""}` });
  } else if (standardFound === 2) {
    formattingScore = 4;
    feedback.push({ section: "Formatting", status: "warning", msg: `Only 2/4 standard headers found — missing: ${missingStandard.join(", ")}`, details: `Many ATS systems rely on standard section names. Add clear headers for ${missingStandard.join(" and ")}.${redFlagsFound.length ? ` Avoid creative headers like "${redFlagsFound.join('", "')}" — rename them to standard equivalents.` : ""}` });
  } else {
    feedback.push({ section: "Formatting", status: "error", msg: `Only ${standardFound}/4 standard headers found`, details: `Your resume is missing most standard section headers. ATS systems may fail to parse it correctly. Use: "Professional Summary," "Work Experience," "Skills," and "Education."${redFlagsFound.length ? ` Replace creative headers like "${redFlagsFound.join('", "')}" with standard ones.` : ""}` });
  }

  // Wall of text penalty: deduct 1 pt per line > 300 chars (max -3)
  const allLines = text.split(/\n/);
  const longLines = allLines.filter((l) => l.trim().length > 300);
  const wallPenalty = Math.min(longLines.length, 3);
  formattingScore = Math.max(formattingScore - wallPenalty, 0);
  if (wallPenalty > 0) {
    const lastFeedback = feedback[feedback.length - 1];
    lastFeedback.details += ` Wall-of-text penalty: ${wallPenalty} line(s) exceed 300 characters — break them into shorter bullets or sentences (-${wallPenalty} pt).`;
    if (lastFeedback.status === "good") lastFeedback.status = "warning";
  }
  total += formattingScore;

  // ── 8. Spelling & Readability (10 pts) ──
  // Typo detection (6 pts)
  const words = text.toLowerCase().split(/[\s,;:.()\[\]{}"'!?/\\]+/).filter(Boolean);
  const typosFound = [];
  const seenTypos = new Set();
  for (const word of words) {
    if (COMMON_TYPOS[word] && !seenTypos.has(word)) {
      seenTypos.add(word);
      typosFound.push({ wrong: word, correct: COMMON_TYPOS[word] });
    }
  }
  const typoCount = typosFound.length;

  let typoScore;
  if (typoCount === 0) typoScore = 6;
  else if (typoCount <= 2) typoScore = 4;
  else if (typoCount <= 5) typoScore = 2;
  else typoScore = 0;

  // Density / readability (4 pts)
  const charCount = text.length;
  const charsPerPage = pageCount > 0 ? charCount / pageCount : charCount;

  let densityScore;
  let densityNote;
  if (charsPerPage < 800) {
    densityScore = 2;
    densityNote = "Resume appears too sparse — add more detail to fill the page";
  } else if (charsPerPage < 1500) {
    densityScore = 3;
    densityNote = "Slightly thin on content — consider expanding bullet points or adding sections";
  } else if (charsPerPage <= 3000) {
    densityScore = 4;
    densityNote = "Good content density — well-balanced and easy to scan";
  } else if (charsPerPage <= 4000) {
    densityScore = 3;
    densityNote = "Content is dense but manageable — consider tightening some sections";
  } else {
    densityScore = 1;
    densityNote = "Wall of text detected — reduce content or spread across more pages for readability";
  }

  total += typoScore + densityScore;

  const typoDetail = typoCount === 0
    ? "No common spelling errors found."
    : typoCount <= 2
      ? `Found ${typoCount} possible typo(s): ${typosFound.map((t) => `"${t.wrong}" → "${t.correct}"`).join(", ")}.`
      : `Found ${typoCount} possible typos including: ${typosFound.slice(0, 3).map((t) => `"${t.wrong}" → "${t.correct}"`).join(", ")}${typoCount > 3 ? ` and ${typoCount - 3} more` : ""}.`;

  const spellingStatus = (typoScore + densityScore >= 8) ? "good" : (typoScore + densityScore >= 5) ? "warning" : "error";

  feedback.push({
    section: "Spelling & Readability",
    status: spellingStatus,
    msg: `${typoCount} typo(s) found · ${densityNote.split("—")[0].trim().toLowerCase()}`,
    details: `${typoDetail} ${densityNote}. (${Math.round(charsPerPage)} chars/page across ${pageCount} page${pageCount > 1 ? "s" : ""})`,
  });

  // ── 9. Page Length (8 pts) ──
  const experienceYears = estimateExperienceYears(text);
  let pageLengthScore;
  let pageLengthNote;

  if (experienceYears > 0 && experienceYears <= 5) {
    if (pageCount === 1) { pageLengthScore = 8; pageLengthNote = "1-page resume is ideal for your experience level (~" + experienceYears + " years)."; }
    else if (pageCount === 2) { pageLengthScore = 4; pageLengthNote = "With ~" + experienceYears + " years of experience, a 1-page resume is recommended. Consider trimming to one page."; }
    else { pageLengthScore = 1; pageLengthNote = "With ~" + experienceYears + " years of experience, " + pageCount + " pages is too long. Aim for 1 page."; }
  } else if (experienceYears > 5 && experienceYears <= 15) {
    if (pageCount === 2) { pageLengthScore = 8; pageLengthNote = "2-page resume is ideal for your experience level (~" + experienceYears + " years)."; }
    else if (pageCount === 1) { pageLengthScore = 5; pageLengthNote = "With ~" + experienceYears + " years of experience, you likely have enough content for 2 pages. Consider expanding."; }
    else { pageLengthScore = 3; pageLengthNote = "With ~" + experienceYears + " years of experience, " + pageCount + " pages may be excessive. Aim for 2 pages."; }
  } else if (experienceYears > 15) {
    if (pageCount >= 2 && pageCount <= 3) { pageLengthScore = 8; pageLengthNote = pageCount + "-page resume is appropriate for your extensive experience (~" + experienceYears + " years)."; }
    else if (pageCount === 1) { pageLengthScore = 4; pageLengthNote = "With ~" + experienceYears + " years of experience, a 1-page resume undersells your career. Expand to 2-3 pages."; }
    else { pageLengthScore = 3; pageLengthNote = "With ~" + experienceYears + " years of experience, " + pageCount + " pages is still excessive. Aim for 2-3 pages."; }
  } else {
    // Can't detect years — use safe defaults
    if (pageCount === 1) { pageLengthScore = 8; pageLengthNote = "1-page resume is a safe default length."; }
    else if (pageCount === 2) { pageLengthScore = 6; pageLengthNote = "2-page resume is acceptable, but ensure all content is relevant."; }
    else { pageLengthScore = 2; pageLengthNote = pageCount + " pages is long — most resumes should be 1-2 pages unless you have 15+ years of experience."; }
  }

  total += pageLengthScore;
  const pageLengthStatus = pageLengthScore >= 7 ? "good" : pageLengthScore >= 4 ? "warning" : "error";
  feedback.push({
    section: "Page Length",
    status: pageLengthStatus,
    msg: `${pageCount} page${pageCount !== 1 ? "s" : ""} · ${experienceYears > 0 ? "~" + experienceYears + " years detected" : "experience years not detected"}`,
    details: `${pageLengthNote} (${pageLengthScore}/8 pts)`,
  });

  return { score: Math.min(total, 100), feedback };
}
