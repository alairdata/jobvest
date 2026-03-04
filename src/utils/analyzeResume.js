// ── Personal pronouns (should never appear in resumes) ──
const PERSONAL_PRONOUNS = ["i ", "i'm", "i've", "i'd", "my ", "me ", "myself", "we ", "our ", "ours", "ourselves"];

// ── Responsibility-oriented phrases (passive, should be rewritten) ──
const RESPONSIBILITY_WORDS = [
  "responsible for", "responsibilities include", "responsibilities included",
  "duties include", "duties included", "tasked with", "in charge of",
  "assigned to", "accountable for",
];

// ── Filler words and adverbs that waste space ──
const FILLER_WORDS = [
  "effectively", "successfully", "basically", "essentially", "significantly",
  "greatly", "tremendously", "extremely", "highly", "very",
  "really", "quite", "fairly", "rather", "somewhat",
  "in order to", "as needed", "on a daily basis", "on a regular basis",
  "as well as", "due to the fact that", "in addition to",
  "for the purpose of", "with the aim of", "in an effort to",
  "a variety of", "a number of", "in terms of",
  "various", "numerous", "several different", "multiple different",
  "helped to", "was able to", "served as", "acted as",
  "quickly", "slowly", "carefully", "diligently", "consistently",
  "proactively", "strategically", "thoughtfully",
];

// ── Vague buzzwords & clichés that add little value ──
const BUZZWORDS = [
  "attention to detail", "problem solving", "presentation skills",
  "critical thinking", "organizational skills", "team player",
  "hard worker", "go-getter", "self-starter", "detail oriented",
  "detail-oriented", "results driven", "results-driven", "think outside the box",
  "synergy", "go above and beyond", "people person", "strong work ethic",
  "passionate", "motivated", "dynamic", "strategic thinker",
  "excellent communication skills", "communication skills",
  "time management", "multitasker", "fast learner", "quick learner",
  "proactive", "innovative thinker", "creative thinker",
  "goal oriented", "goal-oriented", "self motivated", "self-motivated",
  "works well under pressure", "good interpersonal skills",
  "interpersonal skills", "leadership skills", "analytical skills",
  "proven track record", "responsible for", "out of the box",
  "best of breed", "thought leader", "value added", "value-added",
  "highly motivated", "highly organized", "strong communicator",
  "dedicated professional", "seasoned professional",
];

// ── Weak action verbs with strong replacements ──
const WEAK_VERBS = {
  "worked on": ["implemented", "developed", "executed", "delivered"],
  "worked": ["executed", "delivered", "accomplished", "completed"],
  "helped": ["facilitated", "enabled", "supported", "contributed to"],
  "assisted": ["supported", "facilitated", "partnered with", "collaborated on"],
  "was responsible for": ["managed", "led", "oversaw", "directed"],
  "responsible for": ["managed", "led", "oversaw", "directed"],
  "handled": ["managed", "coordinated", "processed", "administered"],
  "did": ["executed", "performed", "completed", "accomplished"],
  "made": ["created", "developed", "produced", "designed"],
  "got": ["secured", "obtained", "achieved", "acquired"],
  "used": ["leveraged", "utilized", "applied", "employed"],
  "utilized": ["leveraged", "applied", "employed", "harnessed"],
  "participated in": ["contributed to", "collaborated on", "engaged in", "co-led"],
  "involved in": ["contributed to", "played a key role in", "drove", "supported"],
  "contributed to": ["drove", "advanced", "strengthened", "elevated"],
  "supported": ["enabled", "empowered", "bolstered", "reinforced"],
  "tried": ["pursued", "endeavored", "sought to", "aimed to"],
  "learned": ["mastered", "acquired proficiency in", "developed expertise in"],
  "communicated": ["presented", "articulated", "conveyed", "briefed"],
  "organized": ["coordinated", "orchestrated", "structured", "systematized"],
  "ran": ["directed", "managed", "oversaw", "led"],
  "dealt with": ["resolved", "addressed", "managed", "navigated"],
  "ensured": ["guaranteed", "maintained", "upheld", "safeguarded"],
  "oversaw": ["directed", "managed", "supervised", "administered"],
  "tasked with": ["charged with", "led", "managed", "spearheaded"],
  "skilled in": ["proficient in", "expert in"],
  "experienced in": ["specialized in", "seasoned in"],
  "in charge of": ["led", "directed", "managed", "headed"],
  "looked after": ["managed", "maintained", "administered", "oversaw"],
  "put together": ["assembled", "compiled", "developed", "designed"],
  "came up with": ["devised", "conceived", "designed", "developed"],
  "set up": ["established", "implemented", "configured", "initiated"],
  "went through": ["completed", "executed", "processed", "reviewed"],
};

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

// ── Extended role domain terms for bullet relevance scoring ──
// Includes both hard skills AND domain-relevant action/context terms
const ROLE_RELEVANCE_TERMS = {
  "data scientist": ["data", "model", "algorithm", "predict", "analysis", "dataset", "feature", "train", "accuracy", "regression", "classification", "cluster", "visualization", "insight", "experiment", "hypothesis", "pipeline", "etl", "warehouse", "query", "report", "dashboard", "metric", "kpi", "trend", "forecast", "python", "sql", "r", "tableau", "power bi", "excel", "statistics", "machine learning", "pandas", "numpy", "tensorflow", "pytorch", "deep learning", "nlp", "neural network"],
  "data analyst": ["data", "analysis", "analyze", "dataset", "visualization", "dashboard", "report", "insight", "trend", "metric", "kpi", "query", "etl", "pipeline", "warehouse", "cleaning", "modeling", "forecast", "chart", "graph", "spreadsheet", "database", "automation", "python", "sql", "r", "tableau", "power bi", "excel", "statistics", "pandas", "bi", "business intelligence", "a/b test", "segment", "stakeholder", "presentation"],
  "product manager": ["product", "roadmap", "feature", "user", "customer", "stakeholder", "sprint", "backlog", "prioritiz", "launch", "metric", "kpi", "strategy", "market", "research", "competitor", "requirement", "spec", "mvp", "adoption", "retention", "engagement", "analytics", "a/b test", "agile", "jira", "sql", "conversion", "revenue", "growth"],
  "product owner": ["product", "roadmap", "feature", "user", "customer", "stakeholder", "sprint", "backlog", "prioritiz", "launch", "metric", "kpi", "strategy", "market", "research", "requirement", "spec", "mvp", "agile", "jira", "acceptance criteria", "user story"],
  "project manager": ["project", "timeline", "milestone", "deliverable", "stakeholder", "budget", "scope", "risk", "resource", "schedule", "agile", "scrum", "sprint", "kanban", "gantt", "status report", "cross-functional", "coordinate", "planning", "jira", "confluence", "ms project", "vendor", "procurement"],
  "software": ["code", "develop", "build", "deploy", "api", "database", "server", "frontend", "backend", "full stack", "test", "debug", "architecture", "microservice", "scalab", "performance", "refactor", "review", "version control", "git", "ci/cd", "agile", "sprint", "javascript", "typescript", "python", "react", "node", "aws", "docker", "rest", "graphql", "endpoint"],
  "developer": ["code", "develop", "build", "deploy", "api", "database", "server", "frontend", "backend", "full stack", "test", "debug", "architecture", "microservice", "scalab", "performance", "refactor", "review", "version control", "git", "ci/cd", "agile", "sprint", "javascript", "typescript", "python", "react", "node", "aws", "docker", "rest", "graphql", "endpoint"],
  "engineer": ["code", "develop", "build", "deploy", "api", "database", "server", "frontend", "backend", "full stack", "test", "debug", "architecture", "microservice", "scalab", "performance", "refactor", "review", "version control", "git", "ci/cd", "agile", "sprint", "system", "infrastructure", "design", "implement", "automat"],
  "designer": ["design", "prototype", "wireframe", "mockup", "user experience", "user interface", "usability", "accessibility", "responsive", "layout", "typography", "color", "brand", "interaction", "figma", "sketch", "adobe", "css", "html", "component", "design system", "user research", "persona", "journey map", "information architecture"],
  "ux": ["user experience", "usability", "research", "interview", "persona", "journey map", "wireframe", "prototype", "test", "accessibility", "heuristic", "information architecture", "interaction", "figma", "sketch", "user flow", "empathy", "design thinking"],
  "ui": ["user interface", "visual design", "component", "design system", "responsive", "layout", "typography", "color", "icon", "animation", "figma", "sketch", "adobe", "css", "pixel", "brand"],
  "marketing": ["marketing", "campaign", "brand", "content", "social media", "seo", "sem", "ppc", "email", "conversion", "engagement", "audience", "segment", "analytics", "roi", "funnel", "lead", "acquisition", "retention", "growth", "strategy", "channel", "copywriting", "creative", "google analytics", "hubspot", "ads", "crm"],
  "devops": ["deploy", "pipeline", "ci/cd", "infrastructure", "container", "orchestrat", "monitor", "alert", "automat", "provision", "cloud", "server", "uptime", "incident", "docker", "kubernetes", "terraform", "aws", "gcp", "azure", "linux", "ansible", "jenkins", "scalab", "reliability"],
  "sre": ["reliability", "incident", "monitor", "alert", "sla", "slo", "uptime", "availability", "latency", "performance", "postmortem", "runbook", "automat", "toil", "docker", "kubernetes", "terraform", "aws", "gcp", "azure", "linux", "on-call"],
  "accountant": ["accounting", "financial", "audit", "tax", "reconcil", "ledger", "journal", "invoice", "payroll", "compliance", "gaap", "ifrs", "budget", "forecast", "variance", "revenue", "expense", "balance sheet", "income statement", "excel", "quickbooks", "sap", "erp"],
  "finance": ["financial", "investment", "portfolio", "risk", "valuation", "model", "forecast", "budget", "revenue", "profit", "capital", "equity", "debt", "analysis", "report", "compliance", "regulatory", "excel", "bloomberg", "sap", "erp"],
  "nurse": ["patient", "care", "clinical", "treatment", "medication", "assessment", "vital", "chart", "protocol", "triage", "wound", "iv", "ehr", "hipaa", "safety", "infection control", "cpr", "emergency"],
  "healthcare": ["patient", "care", "clinical", "treatment", "health", "medical", "diagnosis", "therapy", "ehr", "hipaa", "compliance", "safety", "protocol", "outcome", "quality"],
  "teacher": ["student", "teach", "curriculum", "lesson", "classroom", "assessment", "grade", "learning", "instruction", "differentiat", "engage", "parent", "education", "academic", "lms", "training"],
  "manager": ["team", "lead", "manage", "direct report", "hire", "performance review", "budget", "strategy", "cross-functional", "stakeholder", "project", "deliverable", "prioritiz", "mentor", "coach", "agile", "process improvement"],
  "analytics": ["data", "analysis", "analyze", "dataset", "visualization", "dashboard", "report", "insight", "trend", "metric", "kpi", "query", "etl", "pipeline", "warehouse", "cleaning", "modeling", "forecast", "python", "sql", "r", "tableau", "power bi", "excel", "statistics", "pandas", "bi", "business intelligence"],
};

// ── Industry standards per role: must-haves, nice-to-haves, expected sections, tips ──
const INDUSTRY_STANDARDS = {
  "data scientist": {
    label: "Data Science",
    mustHave: ["python", "sql", "machine learning"],
    niceToHave: ["tensorflow", "pytorch", "deep learning", "nlp", "spark", "aws", "gcp", "docker", "statistics", "r"],
    expectedSections: ["projects", "publications"],
    certs: ["aws certified", "google certified", "tensorflow developer"],
    tips: ["Include a Projects section showcasing ML/AI work", "Mention model performance metrics (accuracy, F1, AUC)", "List relevant Kaggle competitions or research papers"],
  },
  "data analyst": {
    label: "Data Analytics",
    mustHave: ["sql", "excel"],
    niceToHave: ["python", "r", "tableau", "power bi", "google analytics", "pandas", "statistics", "etl", "warehouse", "looker"],
    expectedSections: [],
    certs: ["google data analytics", "microsoft certified", "tableau certified"],
    tips: ["Emphasize dashboard creation and data visualization", "Show business impact with metrics (revenue, efficiency, cost savings)", "Mention stakeholder communication and presenting insights"],
  },
  "product manager": {
    label: "Product Management",
    mustHave: ["roadmap", "stakeholder"],
    niceToHave: ["agile", "jira", "a/b testing", "sql", "analytics", "user research", "okr", "kpi", "sprint"],
    expectedSections: [],
    certs: ["cspo", "pragmatic", "product school"],
    tips: ["Quantify product impact (user growth, revenue, adoption)", "Show cross-functional leadership experience", "Mention data-informed decision making"],
  },
  "product owner": {
    label: "Product Management",
    mustHave: ["backlog", "user story"],
    niceToHave: ["agile", "jira", "sprint", "acceptance criteria", "stakeholder", "roadmap", "scrum"],
    expectedSections: [],
    certs: ["cspo", "pspo", "safe"],
    tips: ["Show experience writing user stories and acceptance criteria", "Mention backlog grooming and sprint planning"],
  },
  "project manager": {
    label: "Project Management",
    mustHave: ["project", "stakeholder"],
    niceToHave: ["agile", "scrum", "jira", "budget", "risk", "timeline", "milestone", "gantt", "confluence", "ms project"],
    expectedSections: [],
    certs: ["pmp", "prince2", "csm", "safe", "capm"],
    tips: ["Highlight on-time and under-budget delivery", "Show risk management and stakeholder communication", "PMP or PRINCE2 certification strongly recommended"],
  },
  "software": {
    label: "Software Engineering",
    mustHave: ["git"],
    niceToHave: ["javascript", "typescript", "python", "react", "node", "aws", "docker", "ci/cd", "api", "sql", "kubernetes", "microservice", "test"],
    expectedSections: ["projects"],
    certs: ["aws certified", "azure certified", "google cloud"],
    tips: ["Include a Projects or Open Source section with GitHub links", "Mention system design and architecture decisions", "Show CI/CD and testing practices"],
  },
  "developer": {
    label: "Software Engineering",
    mustHave: ["git"],
    niceToHave: ["javascript", "typescript", "python", "react", "node", "aws", "docker", "ci/cd", "api", "sql", "kubernetes", "test"],
    expectedSections: ["projects"],
    certs: ["aws certified", "azure certified"],
    tips: ["Include a Projects section with GitHub links", "Mention code review and collaboration practices", "Show deployment and testing experience"],
  },
  "engineer": {
    label: "Engineering",
    mustHave: ["git"],
    niceToHave: ["javascript", "typescript", "python", "react", "node", "aws", "docker", "ci/cd", "api", "sql", "system", "architecture"],
    expectedSections: ["projects"],
    certs: ["aws certified", "azure certified"],
    tips: ["Include a Projects section with GitHub links", "Show system design and scalability experience"],
  },
  "designer": {
    label: "Design",
    mustHave: ["figma"],
    niceToHave: ["sketch", "adobe", "prototyping", "wireframing", "user research", "accessibility", "design system", "css", "html"],
    expectedSections: ["portfolio"],
    certs: [],
    tips: ["Include a portfolio link prominently at the top", "Show your design process, not just final outputs", "Mention usability testing and iteration"],
  },
  "ux": {
    label: "UX Design",
    mustHave: ["user research"],
    niceToHave: ["figma", "prototype", "wireframe", "usability", "accessibility", "persona", "journey map", "design thinking", "information architecture"],
    expectedSections: ["portfolio"],
    certs: ["google ux", "nielsen norman"],
    tips: ["Include a portfolio link showing your UX process", "Emphasize research methods and user insights", "Show before/after metrics from your design changes"],
  },
  "ui": {
    label: "UI Design",
    mustHave: ["figma"],
    niceToHave: ["sketch", "adobe", "design system", "component", "responsive", "typography", "css"],
    expectedSections: ["portfolio"],
    certs: [],
    tips: ["Include a portfolio link showcasing visual design work", "Mention design systems and component libraries you've built"],
  },
  "marketing": {
    label: "Marketing",
    mustHave: ["campaign"],
    niceToHave: ["seo", "google analytics", "social media", "hubspot", "email", "content", "ppc", "crm", "conversion", "roi"],
    expectedSections: [],
    certs: ["google ads", "hubspot", "google analytics", "facebook blueprint"],
    tips: ["Quantify campaign results (ROI, conversions, reach, engagement)", "Show experience across multiple channels", "Mention A/B testing and data-driven optimization"],
  },
  "devops": {
    label: "DevOps",
    mustHave: ["ci/cd", "docker"],
    niceToHave: ["kubernetes", "terraform", "aws", "gcp", "azure", "linux", "ansible", "jenkins", "monitoring", "infrastructure as code"],
    expectedSections: [],
    certs: ["aws certified", "cka", "ckad", "azure devops", "terraform associate"],
    tips: ["Highlight uptime improvements and incident reduction", "Show infrastructure-as-code practices", "Mention monitoring, alerting, and observability tools"],
  },
  "sre": {
    label: "Site Reliability Engineering",
    mustHave: ["monitoring", "incident"],
    niceToHave: ["sla", "slo", "kubernetes", "terraform", "aws", "docker", "linux", "on-call", "postmortem", "automation"],
    expectedSections: [],
    certs: ["aws certified", "cka", "google cloud"],
    tips: ["Quantify uptime/availability improvements", "Show incident response and postmortem practices", "Mention SLA/SLO targets you maintained"],
  },
  "accountant": {
    label: "Accounting",
    mustHave: ["excel"],
    niceToHave: ["gaap", "ifrs", "quickbooks", "sap", "audit", "tax", "reconciliation", "financial reporting", "erp", "compliance"],
    expectedSections: [],
    certs: ["cpa", "cma", "acca", "cia"],
    tips: ["CPA certification is strongly expected in this field", "Emphasize accuracy, compliance, and audit experience", "Quantify the scope of accounts managed (revenue, transactions)"],
  },
  "finance": {
    label: "Finance",
    mustHave: ["excel", "financial"],
    niceToHave: ["modeling", "valuation", "bloomberg", "sap", "forecasting", "budgeting", "risk", "compliance", "investment"],
    expectedSections: [],
    certs: ["cfa", "cpa", "frm", "caia"],
    tips: ["CFA or CPA certification is highly valued", "Show deal sizes, portfolio values, or budget scope", "Mention financial modeling and valuation methods"],
  },
  "nurse": {
    label: "Nursing / Healthcare",
    mustHave: ["patient"],
    niceToHave: ["ehr", "hipaa", "clinical", "medication", "triage", "cpr", "vital", "assessment", "infection control"],
    expectedSections: ["licenses", "certifications"],
    certs: ["rn", "bsn", "bls", "acls", "cpr"],
    tips: ["List nursing license and state prominently", "Include all clinical certifications (BLS, ACLS)", "Mention patient-to-nurse ratios and unit sizes"],
  },
  "healthcare": {
    label: "Healthcare",
    mustHave: ["patient"],
    niceToHave: ["ehr", "hipaa", "clinical", "compliance", "protocol", "outcome", "quality"],
    expectedSections: ["licenses", "certifications"],
    certs: ["bls", "acls", "hipaa"],
    tips: ["Include all licenses and certifications", "Emphasize patient outcomes and quality metrics"],
  },
  "teacher": {
    label: "Education",
    mustHave: ["student", "curriculum"],
    niceToHave: ["lesson", "assessment", "classroom", "differentiat", "lms", "instruction", "engage", "academic"],
    expectedSections: ["certifications"],
    certs: ["teaching license", "tesol", "tefl"],
    tips: ["Include teaching certification and subject areas", "Show student outcome improvements with metrics", "Mention class sizes and grade levels"],
  },
  "manager": {
    label: "Management",
    mustHave: ["team", "lead"],
    niceToHave: ["budget", "strategy", "stakeholder", "hire", "performance", "cross-functional", "mentor", "agile", "process improvement"],
    expectedSections: [],
    certs: ["pmp", "csm", "six sigma"],
    tips: ["Quantify team size and scope of responsibility", "Show hiring, mentoring, and performance management experience", "Highlight budget ownership and P&L responsibility"],
  },
  "analytics": {
    label: "Analytics",
    mustHave: ["sql", "data"],
    niceToHave: ["python", "r", "tableau", "power bi", "excel", "statistics", "etl", "dashboard", "visualization", "bi"],
    expectedSections: [],
    certs: ["google data analytics", "microsoft certified", "tableau certified"],
    tips: ["Emphasize dashboard creation and data storytelling", "Show business impact with concrete metrics", "Mention ETL and data pipeline experience"],
  },
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

  // Extract summary text up to the next section header
  let summaryText = "";
  let summaryHeadingUsed = "";
  if (hasSummarySection) {
    for (const alias of summaryAliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) {
        summaryHeadingUsed = alias;
        // Extract text after the heading until the next section or 500 chars
        const afterHeading = idx + alias.length;
        const remaining = text.slice(afterHeading, afterHeading + 500);
        // Cut at next section header if found
        const nextHeaderMatch = remaining.match(/\n\s*(experience|education|skills|technical skills|work|employment|projects|certifications?|awards?|publications?|volunteer)\s*(\n|:|$)/i);
        summaryText = nextHeaderMatch ? remaining.slice(0, nextHeaderMatch.index) : remaining;
        summaryText = summaryText.trim();
        break;
      }
    }
  }

  const summaryWords = summaryText.split(/\s+/).filter(Boolean);
  const summaryWordCount = summaryWords.length;
  const roleTerms = ["engineer", "developer", "analyst", "manager", "designer", "scientist", "consultant", "specialist", "lead", "architect", "coordinator"];
  const hasRoleTerms = roleTerms.some((t) => lower.includes(t));

  // Count metrics/numbers in summary
  const summaryMetrics = (summaryText.match(/\d+%|\$[\d,.]+[KkMmBb]?|\b\d{1,3}(,\d{3})+\b|\b\d+[KkMmBb]\b|\b\d+\+?\s*(years?|clients?|projects?|teams?|employees?|users?|departments?|companies|stakeholders)/gi) || []);
  const summaryMetricCount = summaryMetrics.length;

  // Check for buzzwords in summary specifically
  const summaryLower = summaryText.toLowerCase();
  const summaryBuzzwords = BUZZWORDS.filter((bw) => summaryLower.includes(bw));

  // Detect accepted heading names for ATS
  const atsAcceptedHeadings = ["professional summary", "summary", "profile", "career summary", "executive summary"];
  const headingIsAtsOk = atsAcceptedHeadings.some((h) => summaryHeadingUsed.toLowerCase() === h);

  // Estimate experience years early for summary advice
  const estimatedYears = estimateExperienceYears(text);
  const needsSummary = estimatedYears >= 10 || pageCount >= 2;

  if (isObjectiveHeading) {
    total += 5;
    feedback.push({ section: "Professional Summary", status: "warning", msg: "\"Objective\" statements are outdated — switch to a Professional Summary", details: "Objective sections (e.g. 'I want a job where...') are considered outdated by most recruiters. Replace with a 'Professional Summary' that highlights your value proposition in 3-5 sentences. Capped at 5/12 pts." });
  } else if (hasSummarySection) {
    // Build sub-checks
    const subChecks = [];
    let summaryScore = 12;

    // Length check
    if (summaryWordCount > 100) {
      summaryScore -= 2;
      subChecks.push({ label: "Length", status: "warning", note: `${summaryWordCount} words (recommended: 100 words or less). Your summary is too long — keep it concise so recruiters can scan it quickly.` });
    } else if (summaryWordCount < 15) {
      summaryScore -= 3;
      subChecks.push({ label: "Length", status: "warning", note: `${summaryWordCount} words (recommended: 30-100 words). Your summary is too short to be effective.` });
    } else {
      subChecks.push({ label: "Length", status: "good", note: `${summaryWordCount} words (recommended: 100 words or less)` });
    }

    // Metrics check
    if (summaryMetricCount >= 2) {
      subChecks.push({ label: "Metrics", status: "good", note: `${summaryMetricCount} metrics found (recommended: 2 or more)` });
    } else {
      summaryScore -= 2;
      subChecks.push({ label: "Metrics", status: "warning", note: `${summaryMetricCount} metric${summaryMetricCount === 1 ? "" : "s"} found (recommended: 2 or more). Numbers and metrics make your achievements concrete and memorable. Include at least two quantifiable results (e.g., project scales, revenue impacts, team sizes).` });
    }

    // Buzzwords in summary
    if (summaryBuzzwords.length === 0) {
      subChecks.push({ label: "Buzzwords", status: "good", note: "No buzzwords or clichés found in summary (target: zero)" });
    } else {
      summaryScore -= 2;
      subChecks.push({ label: "Buzzwords", status: "warning", note: `${summaryBuzzwords.length} buzzword${summaryBuzzwords.length > 1 ? "s" : ""} found (target: zero). Remove: ${summaryBuzzwords.map((b) => `"${b}"`).join(", ")}. These are overused and often seen as red flags by employers.` });
    }

    // Role-specific language
    if (!hasRoleTerms) {
      summaryScore -= 1;
      subChecks.push({ label: "Role keywords", status: "warning", note: "No role-specific terms found. Include your target role title to help ATS and recruiters." });
    }

    // Section heading ATS check
    if (headingIsAtsOk) {
      subChecks.push({ label: "Section title", status: "good", note: `"${summaryHeadingUsed}" can be detected by resume screeners.` });
    } else if (summaryHeadingUsed) {
      subChecks.push({ label: "Section title", status: "warning", note: `"${summaryHeadingUsed}" may not be recognized by all ATS. Consider using "Professional Summary" or "Summary" instead.` });
    }

    // Necessity check — advice for those who may not need one
    if (!needsSummary && summaryScore < 10) {
      subChecks.push({ label: "Do you need one?", status: "info", note: `A resume summary is optional. With ~${estimatedYears > 0 ? estimatedYears : "few"} years of experience and ${pageCount} page${pageCount > 1 ? "s" : ""}, your experience section may speak for itself. A generic summary is worse than no summary — if yours just repeats your resume, consider removing it.` });
    }

    summaryScore = Math.max(summaryScore, 0);
    total += summaryScore;

    const goodChecks = subChecks.filter((c) => c.status === "good").length;
    const totalChecks = subChecks.filter((c) => c.status !== "info").length;
    const issueLabels = subChecks.filter((c) => c.status === "warning").map((c) => c.label.toLowerCase());
    const status = summaryScore >= 10 ? "good" : summaryScore >= 6 ? "warning" : "error";
    const msg = issueLabels.length === 0
      ? `Strong summary — ${goodChecks}/${totalChecks} checks passed`
      : `Summary needs work — lacks ${issueLabels.join(" and ")}`;
    const details = subChecks.map((c) => `${c.status === "good" ? "✓" : c.status === "warning" ? "✗" : "ℹ"} ${c.label}: ${c.note}`).join("\n");

    feedback.push({ section: "Professional Summary", status, msg, details });
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

  // ── 10. Buzzwords & Clichés (penalty up to -8 pts) ──
  const buzzwordsFound = BUZZWORDS.filter((bw) => lower.includes(bw));
  const buzzwordCount = buzzwordsFound.length;

  if (buzzwordCount === 0) {
    feedback.push({
      section: "Buzzwords & Clichés",
      status: "good",
      msg: "No vague buzzwords detected",
      details: "Your resume avoids overused clichés. This is great — employers value specific, evidence-backed language over subjective claims.",
    });
  } else {
    // Deduct 2 pts per buzzword, max -8
    const buzzPenalty = Math.min(buzzwordCount * 2, 8);
    total -= buzzPenalty;
    const displayBuzzwords = buzzwordsFound.slice(0, 5).map((b) => `"${b}"`).join(", ");
    const extra = buzzwordCount > 5 ? ` and ${buzzwordCount - 5} more` : "";

    if (buzzwordCount <= 2) {
      feedback.push({
        section: "Buzzwords & Clichés",
        status: "warning",
        msg: `${buzzwordCount} vague buzzword${buzzwordCount > 1 ? "s" : ""} found (-${buzzPenalty} pts)`,
        details: `Found: ${displayBuzzwords}${extra}. These terms are considered clichés because they're overused and not backed by evidence. Try to remove them or demonstrate these qualities through your work experience instead.`,
      });
    } else {
      feedback.push({
        section: "Buzzwords & Clichés",
        status: "error",
        msg: `${buzzwordCount} vague buzzwords found (-${buzzPenalty} pts)`,
        details: `Found: ${displayBuzzwords}${extra}. Too many buzzwords can make your resume look like you've misunderstood its purpose. Remove these phrases entirely or replace them with specific achievements that demonstrate these qualities. Keep your Skills section for hard skills (tools, software, techniques) — not subjective traits.`,
      });
    }
  }

  // ── 11. Chronological Order (informational — no extra points, penalty if wrong) ──
  if (hasJobEntries && jobEntries.length >= 2) {
    let outOfOrder = false;
    for (let i = 1; i < jobEntries.length; i++) {
      if (jobEntries[i].endYear > jobEntries[i - 1].endYear) {
        outOfOrder = true;
        break;
      }
    }
    if (!outOfOrder) {
      feedback.push({
        section: "Chronological Order",
        status: "good",
        msg: "Experiences are in reverse chronological order",
        details: "Your most recent roles appear first, which is exactly what recruiters expect. This makes it easy for them to see your latest and most relevant experience at a glance.",
      });
    } else {
      total -= 4;
      feedback.push({
        section: "Chronological Order",
        status: "error",
        msg: "Experiences are not in reverse chronological order (-4 pts)",
        details: "Your roles should be listed with the most recent job at the top and oldest at the bottom. Recruiters want to see your latest experience first. Reorder your work history so the most recent role comes first.",
      });
    }
  }

  // ── 12. Date Consistency (penalty up to -4 pts) ──
  // Detect all date formats used across the entire resume
  const dateFormats = {
    fullMonth: [],    // "January 2020", "February 2024"
    abbrMonth: [],    // "Jan 2020", "Feb 2024"
    mmYYYY: [],       // "01/2020", "02/2024"
    mmYY: [],         // "01/20", "02/24"
    yearOnly: [],     // "2020 - 2024"
    season: [],       // "Summer 2020", "Fall 2024"
  };

  const fullMonthPattern = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/gi;
  const abbrMonthPattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s+\d{4}\b/gi;
  const mmYYYYPattern = /\b(0?[1-9]|1[0-2])\/\d{4}\b/g;
  const mmYYPattern = /\b(0?[1-9]|1[0-2])\/\d{2}\b/g;
  const seasonPattern = /\b(spring|summer|fall|autumn|winter)\s+\d{4}\b/gi;

  let m;
  const fullMonthPositions = new Set();
  while ((m = fullMonthPattern.exec(text)) !== null) {
    dateFormats.fullMonth.push(m[0]);
    fullMonthPositions.add(m.index);
  }
  while ((m = abbrMonthPattern.exec(text)) !== null) {
    // Skip if this position was already matched as a full month (e.g. "Jan" inside "January")
    if (!fullMonthPositions.has(m.index)) dateFormats.abbrMonth.push(m[0]);
  }
  while ((m = mmYYYYPattern.exec(text)) !== null) dateFormats.mmYYYY.push(m[0]);
  while ((m = mmYYPattern.exec(text)) !== null) {
    // Exclude if already matched as MM/YYYY
    if (!dateFormats.mmYYYY.some((f) => f.startsWith(m[0]))) dateFormats.mmYY.push(m[0]);
  }
  while ((m = seasonPattern.exec(text)) !== null) dateFormats.season.push(m[0]);

  // Count which month+year formats are actually used (excluding year-only and seasons)
  const usedFormats = [];
  if (dateFormats.fullMonth.length > 0) usedFormats.push({ name: "Full month and years", examples: dateFormats.fullMonth });
  if (dateFormats.abbrMonth.length > 0) usedFormats.push({ name: "Abbreviated month and years", examples: dateFormats.abbrMonth });
  if (dateFormats.mmYYYY.length > 0) usedFormats.push({ name: "MM/YYYY", examples: dateFormats.mmYYYY });
  if (dateFormats.mmYY.length > 0) usedFormats.push({ name: "MM/YY", examples: dateFormats.mmYY });
  if (dateFormats.season.length > 0) usedFormats.push({ name: "Seasons and year", examples: dateFormats.season });

  if (usedFormats.length <= 1) {
    feedback.push({
      section: "Date Consistency",
      status: "good",
      msg: "Date formats are consistent throughout",
      details: usedFormats.length === 1
        ? `All dates use the ${usedFormats[0].name.toLowerCase()} format (e.g. ${usedFormats[0].examples.slice(0, 2).join(", ")}). Consistent formatting looks professional.`
        : "No date formatting issues detected.",
    });
  } else {
    // Multiple formats found — penalize
    const datePenalty = Math.min((usedFormats.length - 1) * 2, 4);
    total -= datePenalty;
    const formatList = usedFormats.map((f) => `${f.name}: ${f.examples.slice(0, 3).join(", ")}`).join(". ");

    feedback.push({
      section: "Date Consistency",
      status: usedFormats.length === 2 ? "warning" : "error",
      msg: `${usedFormats.length} different date formats found (-${datePenalty} pts)`,
      details: `Your dates are formatted inconsistently. ${formatList}. Choose one date format and stick to it throughout your resume. The most common formats are: "June 2016 - June 2017" (full month), "Jun 2016 - Jun 2017" (abbreviated), or "06/2016 - 06/2017" (MM/YYYY).`,
    });
  }

  // ── 13. Weak Action Verbs (penalty up to -5 pts) ──
  // Check bullets for weak/passive verb starts and suggest strong replacements
  const weakVerbFindings = []; // { bullet, weakVerb, suggestions }
  const weakVerbSet = new Set();

  for (const bullet of bullets) {
    const cleaned = bullet.replace(/^\s*[•\-*▪●\d.]\s*/, "").trim();
    const cleanedLower = cleaned.toLowerCase();

    // Check against weak verbs — try multi-word matches first (longer keys first)
    const sortedWeakKeys = Object.keys(WEAK_VERBS).sort((a, b) => b.length - a.length);
    for (const weak of sortedWeakKeys) {
      if (cleanedLower.startsWith(weak + " ") || cleanedLower.startsWith(weak + ",") || cleanedLower === weak) {
        weakVerbFindings.push({
          bullet: cleaned.length > 120 ? cleaned.slice(0, 117) + "..." : cleaned,
          weakVerb: weak,
          suggestions: WEAK_VERBS[weak],
        });
        weakVerbSet.add(weak);
        break; // Only flag the first weak verb match per bullet
      }
    }
  }

  const weakVerbCount = weakVerbFindings.length;
  const uniqueWeakVerbs = [...weakVerbSet];

  if (weakVerbCount === 0) {
    feedback.push({
      section: "Action Verbs",
      status: "good",
      msg: "No weak action verbs detected",
      details: "Your bullets use strong, compelling action verbs. This makes your achievements sound impactful and shows you took an active role in your work.",
    });
  } else {
    const weakPenalty = Math.min(weakVerbCount * 2, 5);
    total -= weakPenalty;

    const verbList = uniqueWeakVerbs.map((v) => `"${v}"`).join(", ");
    let details = `Found ${weakVerbCount} bullet${weakVerbCount > 1 ? "s" : ""} starting with weak verbs: ${verbList}. These verbs make your achievements sound less impactful and suggest you didn't take an active role in the work.\n`;

    // Show each problematic bullet with its replacement suggestions
    details += "\nBullets to strengthen:";
    for (const finding of weakVerbFindings.slice(0, 5)) {
      details += `\n• "${finding.bullet}"`;
      details += `\n  "${finding.weakVerb}" → try: ${finding.suggestions.slice(0, 3).join(", ")}`;
    }
    if (weakVerbFindings.length > 5) {
      details += `\n...and ${weakVerbFindings.length - 5} more`;
    }

    details += "\n\nStrong action verbs to use: Analyzed, Developed, Directed, Implemented, Spearheaded, Launched, Designed, Orchestrated, Streamlined, Pioneered, Revamped, Created, Improved, Collaborated, Introduced.";

    feedback.push({
      section: "Action Verbs",
      status: weakVerbCount <= 2 ? "warning" : "error",
      msg: `${weakVerbCount} weak action verb${weakVerbCount > 1 ? "s" : ""} found (-${weakPenalty} pts)`,
      details,
    });
  }

  // ── 14. Repetitive Action Verbs (penalty up to -4 pts) ──
  // Count first-word verb frequency across all bullets
  const verbFrequency = new Map();
  for (const bullet of bullets) {
    const cleaned = bullet.replace(/^\s*[•\-*▪●\d.]\s*/, "").trim().toLowerCase();
    const firstWord = cleaned.split(/\s+/)[0] || "";
    // Only count actual verbs (at least 3 chars, not articles/prepositions)
    const skipWords = new Set(["the", "a", "an", "in", "on", "at", "to", "for", "of", "with", "by", "as", "is", "was", "and", "or", "my", "our", "all", "new"]);
    if (firstWord.length >= 3 && !skipWords.has(firstWord)) {
      verbFrequency.set(firstWord, (verbFrequency.get(firstWord) || 0) + 1);
    }
  }

  // Find overused verbs (used 3+ times)
  const overusedVerbs = [...verbFrequency.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);

  if (overusedVerbs.length === 0) {
    feedback.push({
      section: "Verb Variety",
      status: "good",
      msg: "Good variety of action verbs throughout",
      details: "No action verb is overused on your resume. This variety shows hiring managers you have a range of different skill sets and keeps your resume engaging to read.",
    });
  } else {
    const repPenalty = Math.min(overusedVerbs.length * 2, 4);
    total -= repPenalty;

    const verbListDisplay = overusedVerbs
      .map(([verb, count]) => `${verb.charAt(0).toUpperCase() + verb.slice(1)} (${count} times)`)
      .join(", ");

    // Suggest alternatives for each overused verb
    let details = `Using the same action verb more than 2 times reduces your resume's impact and makes it harder for your achievements to stand out.\n\nOverused verbs:`;

    for (const [verb, count] of overusedVerbs) {
      details += `\n• ${verb.charAt(0).toUpperCase() + verb.slice(1)} — used ${count} times`;

      // Find synonyms from POWER_VERBS that aren't already overused
      const overusedSet = new Set(overusedVerbs.map(([v]) => v));
      const synonymMap = {
        developed: ["designed", "engineered", "built", "created", "crafted"],
        managed: ["directed", "oversaw", "coordinated", "supervised", "led"],
        led: ["spearheaded", "directed", "headed", "championed", "guided"],
        created: ["designed", "developed", "built", "produced", "established"],
        implemented: ["deployed", "executed", "launched", "introduced", "rolled out"],
        improved: ["enhanced", "optimized", "strengthened", "elevated", "refined"],
        built: ["engineered", "constructed", "developed", "designed", "assembled"],
        designed: ["architected", "crafted", "devised", "created", "conceptualized"],
        analyzed: ["evaluated", "assessed", "examined", "investigated", "reviewed"],
        established: ["founded", "launched", "initiated", "set up", "introduced"],
        delivered: ["produced", "completed", "executed", "provided", "shipped"],
        reduced: ["decreased", "cut", "lowered", "minimized", "streamlined"],
        increased: ["grew", "boosted", "expanded", "raised", "amplified"],
        coordinated: ["orchestrated", "organized", "aligned", "synchronized", "facilitated"],
        automated: ["streamlined", "mechanized", "systematized", "programmed"],
        launched: ["introduced", "rolled out", "debuted", "initiated", "released"],
        conducted: ["performed", "executed", "carried out", "administered"],
        collaborated: ["partnered", "teamed up", "worked alongside", "co-led"],
        generated: ["produced", "yielded", "created", "drove", "secured"],
        resolved: ["addressed", "fixed", "remedied", "troubleshot", "rectified"],
      };

      const alts = synonymMap[verb] || POWER_VERBS.filter((pv) => pv !== verb && !overusedSet.has(pv)).slice(0, 5);
      details += `\n  Try instead: ${alts.slice(0, 4).join(", ")}`;
    }

    details += "\n\nReview your bullets and replace repeated verbs with unique alternatives. This shows hiring managers you have a diverse range of skills and accomplishments.";

    feedback.push({
      section: "Verb Variety",
      status: overusedVerbs.length <= 1 ? "warning" : "error",
      msg: `${overusedVerbs.length} overused verb${overusedVerbs.length > 1 ? "s" : ""}: ${verbListDisplay} (-${repPenalty} pts)`,
      details,
    });
  }

  // ── 15. Job Fit / Role Relevance (penalty up to -6 pts) ──
  // Score each bullet for relevance to the detected target role
  const detectedRoleFit = detectRole(summaryText) || detectRole(lower);

  if (detectedRoleFit && bullets.length >= 3) {
    const roleKey = detectedRoleFit.role;
    // Use extended relevance terms if available, fallback to skill map
    const relevanceTerms = ROLE_RELEVANCE_TERMS[roleKey] || detectedRoleFit.skills;
    const roleName = roleKey.charAt(0).toUpperCase() + roleKey.slice(1);

    // Score each bullet: count how many relevance terms appear
    const bulletScores = bullets.map((bullet) => {
      const bLower = bullet.toLowerCase();
      const matchedTerms = relevanceTerms.filter((term) => bLower.includes(term));
      // A bullet is "relevant" if it matches 2+ terms, "medium" if 1 term, "low" if 0
      return { text: bullet.replace(/^\s*[•\-*▪●\d.]\s*/, "").trim(), matches: matchedTerms.length };
    });

    const highRelevance = bulletScores.filter((b) => b.matches >= 2).length;
    const mediumRelevance = bulletScores.filter((b) => b.matches === 1).length;
    const lowRelevance = bulletScores.filter((b) => b.matches === 0).length;
    const totalBulletsForFit = bulletScores.length;

    // Weighted fit: high=1.0, medium=0.5, low=0.0
    const fitScore = totalBulletsForFit > 0
      ? Math.round(((highRelevance + mediumRelevance * 0.5) / totalBulletsForFit) * 100)
      : 0;

    // Collect low-relevance bullets to show user (max 6)
    const lowBullets = bulletScores
      .filter((b) => b.matches === 0)
      .slice(0, 6)
      .map((b) => b.text.length > 120 ? b.text.slice(0, 117) + "..." : b.text);
    const medBullets = bulletScores
      .filter((b) => b.matches === 1)
      .slice(0, 3)
      .map((b) => b.text.length > 120 ? b.text.slice(0, 117) + "..." : b.text);

    let fitPenalty = 0;
    let fitStatus;
    let fitMsg;

    if (fitScore >= 75) {
      fitStatus = "good";
      fitMsg = `${fitScore}% fit for ${roleName} — well-focused resume`;
    } else if (fitScore >= 50) {
      fitPenalty = 3;
      fitStatus = "warning";
      fitMsg = `${fitScore}% fit for ${roleName} — could be more focused`;
    } else {
      fitPenalty = 6;
      fitStatus = "error";
      fitMsg = `${fitScore}% fit for ${roleName} — too many irrelevant bullets`;
    }

    total -= fitPenalty;

    let fitDetails = `Target: ${roleName}. ${highRelevance} high-relevance, ${mediumRelevance} medium-relevance, and ${lowRelevance} low-relevance bullet${lowRelevance !== 1 ? "s" : ""} out of ${totalBulletsForFit} total.`;

    if (fitScore >= 75) {
      fitDetails += " Your resume is well-focused on your target role. Most bullets show accomplishments and skills that a hiring manager in your field would value.";
    } else {
      fitDetails += " Your resume contains too many details that aren't relevant to your target role. Hiring managers may think you don't have the right experience.";

      if (lowBullets.length > 0) {
        fitDetails += `\n\nLow-relevance bullets to revise or remove:\n${lowBullets.map((b) => `• "${b}"`).join("\n")}`;
      }
      if (medBullets.length > 0) {
        fitDetails += `\n\nMedium-relevance bullets that could be stronger:\n${medBullets.map((b) => `• "${b}"`).join("\n")}`;
      }

      fitDetails += "\n\nFor each bullet, ask: \"Would this matter to someone hiring for my target role?\" If not, either remove it or rewrite it to highlight relevant skills. For older or less relevant roles, list just 1-2 relevant bullets or remove them entirely.";
    }

    if (fitPenalty > 0) fitMsg += ` (-${fitPenalty} pts)`;

    feedback.push({
      section: "Job Fit",
      status: fitStatus,
      msg: fitMsg,
      details: fitDetails,
    });
  }

  // ── 16. Industry Standards (penalty up to -6 pts) ──
  // Check resume against industry-specific expectations for the detected role
  const roleForStandards = detectRole(summaryText) || detectRole(lower);
  const standards = roleForStandards ? INDUSTRY_STANDARDS[roleForStandards.role] : null;

  if (standards) {
    const roleName = standards.label;
    const checks = [];
    let stdPenalty = 0;

    // Must-have tools/skills check
    const missingMustHave = standards.mustHave.filter((tool) => !lower.includes(tool));
    const foundMustHave = standards.mustHave.filter((tool) => lower.includes(tool));

    if (missingMustHave.length === 0) {
      checks.push({ status: "good", note: `Must-have skills present: ${foundMustHave.join(", ")}` });
    } else {
      stdPenalty += Math.min(missingMustHave.length * 2, 4);
      checks.push({ status: "error", note: `Missing must-have skills for ${roleName}: ${missingMustHave.join(", ")}. These are considered baseline requirements in this industry.` });
    }

    // Nice-to-have tools check
    const foundNiceToHave = standards.niceToHave.filter((tool) => lower.includes(tool));
    const missingNiceToHave = standards.niceToHave.filter((tool) => !lower.includes(tool));
    const niceToHaveRatio = standards.niceToHave.length > 0 ? foundNiceToHave.length / standards.niceToHave.length : 1;

    if (niceToHaveRatio >= 0.4) {
      checks.push({ status: "good", note: `${foundNiceToHave.length}/${standards.niceToHave.length} industry tools/skills found: ${foundNiceToHave.slice(0, 6).join(", ")}${foundNiceToHave.length > 6 ? "..." : ""}` });
    } else if (niceToHaveRatio >= 0.2) {
      checks.push({ status: "warning", note: `Only ${foundNiceToHave.length}/${standards.niceToHave.length} common ${roleName} tools found. Consider adding: ${missingNiceToHave.slice(0, 5).join(", ")}` });
    } else {
      stdPenalty += 1;
      checks.push({ status: "error", note: `Only ${foundNiceToHave.length}/${standards.niceToHave.length} common ${roleName} tools found. Your tech stack looks thin for this industry. Add relevant tools: ${missingNiceToHave.slice(0, 5).join(", ")}` });
    }

    // Expected sections check (e.g., Projects for engineers, Portfolio for designers)
    if (standards.expectedSections.length > 0) {
      const missingSections = standards.expectedSections.filter((sec) => {
        const sectionAliases = [sec, sec + "s"]; // e.g. "project" and "projects"
        return !sectionAliases.some((a) => lower.includes(a));
      });
      if (missingSections.length === 0) {
        checks.push({ status: "good", note: `Industry-expected sections present: ${standards.expectedSections.join(", ")}` });
      } else {
        checks.push({ status: "warning", note: `Consider adding a ${missingSections.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ")} section — this is standard in ${roleName} resumes` });
      }
    }

    // Certifications check
    if (standards.certs.length > 0) {
      const foundCerts = standards.certs.filter((cert) => lower.includes(cert));
      if (foundCerts.length > 0) {
        checks.push({ status: "good", note: `Industry certifications found: ${foundCerts.join(", ")}` });
      } else {
        checks.push({ status: "warning", note: `No ${roleName} certifications detected. Relevant certs for this field: ${standards.certs.slice(0, 4).join(", ")}` });
      }
    }

    // Industry tips
    const tipsStr = standards.tips.map((t) => `• ${t}`).join("\n");

    stdPenalty = Math.min(stdPenalty, 6);
    total -= stdPenalty;

    const goodCount = checks.filter((c) => c.status === "good").length;
    const totalChecks = checks.length;
    const hasErrors = checks.some((c) => c.status === "error");
    const stdStatus = hasErrors ? (stdPenalty >= 4 ? "error" : "warning") : goodCount === totalChecks ? "good" : "warning";
    const stdMsg = stdPenalty > 0
      ? `${goodCount}/${totalChecks} ${roleName} standards met (-${stdPenalty} pts)`
      : `${goodCount}/${totalChecks} ${roleName} industry standards met`;

    let stdDetails = checks.map((c) => `${c.status === "good" ? "✓" : c.status === "warning" ? "!" : "✗"} ${c.note}`).join("\n");
    stdDetails += `\n\nIndustry tips for ${roleName}:\n${tipsStr}`;

    feedback.push({
      section: "Industry Standards",
      status: stdStatus,
      msg: stdMsg,
      details: stdDetails,
    });
  }

  // ── 17. Personal Pronouns (penalty up to -4 pts) ──
  const pronounsFound = [];
  const seenPronouns = new Set();
  for (const line of text.split(/\n/)) {
    const lineLower = line.toLowerCase();
    for (const pronoun of PERSONAL_PRONOUNS) {
      // Match pronoun with word boundary awareness (the pronouns have trailing spaces where needed)
      if (lineLower.includes(pronoun) && !seenPronouns.has(pronoun.trim())) {
        seenPronouns.add(pronoun.trim());
        pronounsFound.push({
          pronoun: pronoun.trim(),
          context: line.trim().length > 100 ? line.trim().slice(0, 97) + "..." : line.trim(),
        });
      }
    }
  }

  if (pronounsFound.length === 0) {
    feedback.push({
      section: "Personal Pronouns",
      status: "good",
      msg: "No personal pronouns found",
      details: "Your resume correctly avoids first-person pronouns (I, me, my, we, our). Resumes should use an implied first person — start bullets with action verbs instead.",
    });
  } else {
    const pronounPenalty = Math.min(pronounsFound.length * 2, 4);
    total -= pronounPenalty;
    const pronounList = [...seenPronouns].map((p) => `"${p}"`).join(", ");

    let prDetails = `Found personal pronouns: ${pronounList}. Resumes should never use first-person pronouns. Use an implied first person by starting bullets with action verbs.\n`;
    prDetails += "\nExamples:";
    prDetails += "\n✗ \"I managed a team of 5 engineers\"";
    prDetails += "\n✓ \"Managed a team of 5 engineers\"";
    prDetails += "\n✗ \"My responsibilities included data analysis\"";
    prDetails += "\n✓ \"Analyzed datasets to uncover trends and drive decisions\"";

    feedback.push({
      section: "Personal Pronouns",
      status: pronounsFound.length <= 2 ? "warning" : "error",
      msg: `${pronounsFound.length} personal pronoun${pronounsFound.length > 1 ? "s" : ""} found (-${pronounPenalty} pts)`,
      details: prDetails,
    });
  }

  // ── 18. Responsibility-Oriented Words (penalty up to -4 pts) ──
  const respWordsFound = [];
  for (const bullet of bullets) {
    const bLower = bullet.toLowerCase();
    for (const phrase of RESPONSIBILITY_WORDS) {
      if (bLower.includes(phrase)) {
        const cleaned = bullet.replace(/^\s*[•\-*▪●\d.]\s*/, "").trim();
        respWordsFound.push({
          phrase,
          bullet: cleaned.length > 120 ? cleaned.slice(0, 117) + "..." : cleaned,
        });
        break; // one match per bullet
      }
    }
  }

  if (respWordsFound.length === 0) {
    feedback.push({
      section: "Responsibility-Oriented Words",
      status: "good",
      msg: "No responsibility-oriented phrases found",
      details: "Your bullets focus on achievements rather than duties. This is exactly what recruiters want — they care about what you accomplished, not just what you were assigned to do.",
    });
  } else {
    const respPenalty = Math.min(respWordsFound.length * 2, 4);
    total -= respPenalty;

    let respDetails = `Found ${respWordsFound.length} bullet${respWordsFound.length > 1 ? "s" : ""} using responsibility-oriented language. These phrases make your resume read like a job description instead of a list of achievements.\n`;
    respDetails += "\nBullets to rewrite:";
    for (const finding of respWordsFound.slice(0, 5)) {
      respDetails += `\n• "${finding.bullet}"`;
      respDetails += `\n  Remove "${finding.phrase}" — start with an action verb instead`;
    }
    if (respWordsFound.length > 5) respDetails += `\n...and ${respWordsFound.length - 5} more`;

    respDetails += "\n\nExample:";
    respDetails += "\n✗ \"Responsible for managing a team of 10 developers\"";
    respDetails += "\n✓ \"Managed a team of 10 developers, delivering 3 major releases on schedule\"";

    feedback.push({
      section: "Responsibility-Oriented Words",
      status: respWordsFound.length <= 2 ? "warning" : "error",
      msg: `${respWordsFound.length} responsibility phrase${respWordsFound.length > 1 ? "s" : ""} found (-${respPenalty} pts)`,
      details: respDetails,
    });
  }

  // ── 19. Filler Words (penalty up to -4 pts) ──
  const fillersFound = [];
  const seenFillers = new Set();
  for (const bullet of bullets) {
    const bLower = bullet.toLowerCase();
    for (const filler of FILLER_WORDS) {
      if (bLower.includes(filler) && !seenFillers.has(filler)) {
        seenFillers.add(filler);
        fillersFound.push(filler);
      }
    }
  }

  if (fillersFound.length === 0) {
    feedback.push({
      section: "Filler Words",
      status: "good",
      msg: "No filler words or unnecessary adverbs found",
      details: "Your resume is concise and free of superfluous language. Every word counts — nice work keeping it tight.",
    });
  } else {
    const fillerPenalty = Math.min(fillersFound.length, 4);
    total -= fillerPenalty;
    const fillerDisplay = fillersFound.slice(0, 8).map((f) => `"${f}"`).join(", ");
    const fillerExtra = fillersFound.length > 8 ? ` and ${fillersFound.length - 8} more` : "";

    let fillerDetails = `Found filler words: ${fillerDisplay}${fillerExtra}. These words take up space and dilute your achievements.\n`;
    fillerDetails += "\nWhy remove them:";
    fillerDetails += "\n• Unnecessary: Phrases like \"in order to\" or \"as needed\" don't add anything important";
    fillerDetails += "\n• Vague: Adverbs like \"successfully\" or \"effectively\" are too general. Use specific metrics instead";
    fillerDetails += "\n• Space-wasting: Every word counts — fillers take up space you could use for achievements";
    fillerDetails += "\n\nExample:";
    fillerDetails += "\n✗ \"Successfully and effectively developed a new system quickly\"";
    fillerDetails += "\n✓ \"Developed a new system in 6 months, 3 months ahead of schedule\"";

    feedback.push({
      section: "Filler Words",
      status: fillersFound.length <= 3 ? "warning" : "error",
      msg: `${fillersFound.length} filler word${fillersFound.length > 1 ? "s" : ""} found (-${fillerPenalty} pts)`,
      details: fillerDetails,
    });
  }

  // ── 20. Bullet Point Length (penalty up to -3 pts) ──
  const shortBullets = []; // under 12 words
  const longBullets = [];  // over 35 words
  for (const bullet of bullets) {
    const cleaned = bullet.replace(/^\s*[•\-*▪●\d.]\s*/, "").trim();
    const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
    if (wordCount < 12 && wordCount > 0) {
      shortBullets.push({ text: cleaned, words: wordCount });
    } else if (wordCount > 35) {
      longBullets.push({ text: cleaned.length > 120 ? cleaned.slice(0, 117) + "..." : cleaned, words: wordCount });
    }
  }

  const lengthIssues = shortBullets.length + longBullets.length;

  if (lengthIssues === 0) {
    feedback.push({
      section: "Bullet Length",
      status: "good",
      msg: "All bullet points are well-sized (12-35 words)",
      details: "Your bullet points are the right length — long enough to convey achievements but short enough to be scannable. Great balance.",
    });
  } else {
    const lengthPenalty = Math.min(lengthIssues, 3);
    total -= lengthPenalty;

    let lengthDetails = "";

    if (shortBullets.length > 0) {
      lengthDetails += `${shortBullets.length} bullet${shortBullets.length > 1 ? "s are" : " is"} too short (under 12 words). Adding more detail — numbers, specifics, and outcomes — can showcase your achievements more effectively.\n`;
      lengthDetails += "\nShort bullets to expand:";
      for (const b of shortBullets.slice(0, 4)) {
        lengthDetails += `\n• "${b.text}" (${b.words} words)`;
      }
      if (shortBullets.length > 4) lengthDetails += `\n...and ${shortBullets.length - 4} more`;
    }

    if (longBullets.length > 0) {
      if (shortBullets.length > 0) lengthDetails += "\n\n";
      lengthDetails += `${longBullets.length} bullet${longBullets.length > 1 ? "s are" : " is"} too long (over 35 words). Reduce the length or split into two bullets to improve readability.\n`;
      lengthDetails += "\nLong bullets to shorten:";
      for (const b of longBullets.slice(0, 4)) {
        lengthDetails += `\n• "${b.text}" (${b.words} words)`;
      }
      if (longBullets.length > 4) lengthDetails += `\n...and ${longBullets.length - 4} more`;
    }

    const lengthStatus = lengthIssues <= 2 ? "warning" : "error";
    const parts = [];
    if (shortBullets.length > 0) parts.push(`${shortBullets.length} too short`);
    if (longBullets.length > 0) parts.push(`${longBullets.length} too long`);

    feedback.push({
      section: "Bullet Length",
      status: lengthStatus,
      msg: `${parts.join(", ")} (-${lengthPenalty} pts)`,
      details: lengthDetails,
    });
  }

  return { score: Math.max(Math.min(total, 100), 0), feedback };
}
