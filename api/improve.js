import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText, feedback } = req.body || {};

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
  }

  const feedbackSummary = Array.isArray(feedback)
    ? feedback
        .filter((f) => f.status !== "good")
        .map((f) => `- ${f.section} [${f.status.toUpperCase()}]: ${f.msg}\n  Fix: ${f.details}`)
        .join("\n\n")
    : "";

  const systemPrompt = `You are a professional resume rewriter. You receive raw resume text and specific feedback about weaknesses that MUST be fixed.

Your job:
1. READ EVERY FEEDBACK ITEM CAREFULLY and fix each one specifically. This is your #1 priority.
2. Preserve ALL factual information: names, dates, companies, degrees, job titles, certifications.
3. Rewrite EVERY bullet point using strong action verbs and quantified results (X-Y-Z formula: "Accomplished [X] as measured by [Y] by doing [Z]").
4. If a bullet has no metrics, add reasonable context (e.g., "managed a team" → "Managed a cross-functional team to deliver projects on schedule").
5. Fix all spelling and grammar errors.
6. Use standard ATS-friendly section headers: "Professional Summary", "Work Experience", "Education", "Skills".
7. If the summary is weak or missing, write a strong 3-5 sentence Professional Summary with role-specific keywords.
8. If the skills section is thin, expand it with relevant industry skills and tools.
9. Return ONLY valid JSON (no markdown fences, no explanation) in this exact structure:

{
  "name": "Full Name",
  "contact": "email | phone | linkedin | location",
  "sections": [
    {
      "title": "Professional Summary",
      "content": "3-5 sentence summary paragraph"
    },
    {
      "title": "Work Experience",
      "items": [
        {
          "title": "Job Title",
          "subtitle": "Company Name | Location | Start - End",
          "bullets": ["Achievement bullet 1", "Achievement bullet 2"]
        }
      ]
    },
    {
      "title": "Education",
      "items": [
        {
          "title": "Degree Name",
          "subtitle": "University | Graduation Year",
          "bullets": ["Relevant coursework or honors"]
        }
      ]
    },
    {
      "title": "Skills",
      "content": "Skill 1, Skill 2, Skill 3, ..."
    }
  ]
}

Rules:
- Every section must have either "content" (string) or "items" (array), never both.
- Bullets must start with a strong action verb.
- If the original resume has additional sections (Projects, Certifications, etc.), include them.
- Do NOT invent facts, companies, or metrics that aren't in the original.
- When a bullet lacks metrics, insert conservative, realistic placeholder numbers based on the role context. Use safe estimates:
  - Team sizes: 3-8 for junior roles, 8-15 for mid, 15-30 for senior
  - Percentages: 15-30% improvements (not extreme claims like 90%)
  - Timeframes: "within 3 months", "over 6 months"
  - Revenue/cost: keep proportional to company size
  Examples: "managed a team" → "Managed a team of 5 engineers", "improved performance" → "Improved system performance by 25%", "handled customer issues" → "Resolved 50+ customer issues weekly with 95% satisfaction rate"
- Mark any inserted placeholder number with [*] at the end of that bullet so the user knows to verify it. Example: "Reduced deployment time by 30% through CI/CD automation [*]"`;

  const userMessage = feedbackSummary
    ? `CRITICAL ISSUES TO FIX (address every single one):\n\n${feedbackSummary}\n\n---\n\nOriginal resume text:\n\n${resumeText}`
    : `Improve the following resume — strengthen bullets with metrics, add a strong summary, and use ATS-friendly headers:\n\n${resumeText}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt,
    });

    let responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Strip markdown fences if present
    responseText = responseText
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(responseText);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Improve API error:", err);
    const status = err.status || 500;
    return res
      .status(status)
      .json({ error: err.message || "Failed to improve resume" });
  }
}
