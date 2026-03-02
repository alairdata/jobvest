export const fixFeedback = [
  { section: "Contact Information", status: "good", msg: "All fields present and parseable", details: "Your name, email, phone, and LinkedIn are clearly formatted. No changes needed." },
  { section: "Professional Summary", status: "warning", msg: "Too generic — needs role-specific language", details: "Add specific terms like 'predictive modeling,' 'cross-functional analytics,' or 'stakeholder reporting' to mirror what hiring managers look for." },
  { section: "Skills", status: "warning", msg: "Missing trending tools, consider grouping", details: "Add high-demand tools like TensorFlow, AWS, and GCP. Group skills into categories (Languages, Frameworks, Tools) for better readability." },
  { section: "Work History", status: "error", msg: "Most bullets lack quantified achievements", details: "Use the X-Y-Z formula: 'Accomplished [X] as measured by [Y] by doing [Z].' Example: 'Reduced report time by 60% by building automated Python pipelines serving 5 departments.'" },
  { section: "Education", status: "error", msg: "Relevant coursework or GPA missing", details: "Add relevant coursework (Machine Learning, Statistical Modeling) and GPA if 3.5+ to strengthen your candidacy." },
  { section: "Bullet Quality", status: "warning", msg: "Most bullets lack action verbs + metrics", details: "Rewrite bullets using the formula: '[Action verb] + [what you did] + [measurable result].' Example: 'Streamlined deployment process, reducing release time by 40%.'" },
  { section: "Formatting", status: "good", msg: "All standard section headers found", details: "Your resume uses standard, ATS-friendly headers for Experience, Education, Skills, and Summary." },
  { section: "Spelling & Readability", status: "good", msg: "No typos · good content density", details: "No common spelling errors found. Good content density — well-balanced and easy to scan." },
];

export const launchFeedback = [
  { section: "Contact Information", status: "good", msg: "Clean and ATS-ready", details: "Everything looks perfect." },
  { section: "Professional Summary", status: "good", msg: "Strong role-specific keywords", details: "Your summary includes targeted keywords aligned with data science and ML roles." },
  { section: "Skills", status: "good", msg: "Well-organized with trending tools", details: "Skills are grouped by category and include high-demand tools. Great structure." },
  { section: "Work History", status: "good", msg: "Quantified achievements throughout", details: "Your bullets follow the X-Y-Z formula with clear metrics. Excellent work." },
  { section: "Education", status: "warning", msg: "Add 1-2 relevant courses for keyword boost", details: "Listing courses like 'Advanced ML' or 'Graph Neural Networks' could help with research-heavy roles." },
  { section: "Bullet Quality", status: "good", msg: "Strong action verbs with measurable results", details: "Excellent bullet quality. Your accomplishments are clearly quantified and action-driven." },
  { section: "Formatting", status: "good", msg: "All standard section headers found", details: "Your resume uses standard, ATS-friendly headers for Experience, Education, Skills, and Summary." },
  { section: "Spelling & Readability", status: "good", msg: "No typos · good content density", details: "No common spelling errors found. Good content density — well-balanced and easy to scan." },
];
