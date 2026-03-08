import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText, jdText } = req.body || {};

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
  }
  if (!jdText || typeof jdText !== "string") {
    return res.status(400).json({ error: "jdText is required" });
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. You compare a resume against a job description and produce a structured compatibility score.

Analyze semantically — don't just do keyword matching. Understand synonyms (e.g., "managed" ≈ "led"), related skills (e.g., "React" implies "JavaScript"), and contextual relevance.

Return ONLY valid JSON (no markdown fences, no explanation) in this exact structure:

{
  "score": <number 0-100>,
  "jobTitle": "<role/position title extracted from the JD>",
  "company": "<company name extracted from the JD, or 'Unknown' if not found>",
  "feedback": [
    {
      "section": "<category name>",
      "status": "good" | "warning" | "error",
      "msg": "<one-line summary>",
      "details": "<2-3 sentence explanation with specific, actionable advice>"
    }
  ],
  "missedKeywords": ["<keyword1>", "<keyword2>", ...],
  "mismatchReason": "<string or null>"
}

Rules for mismatchReason:
- ONLY include this when the score is below 50 (poor match). Set to null otherwise.
- Write 2-3 sentences explaining WHY the resume and job are fundamentally mismatched at a career/field level.
- Be specific and semantic: mention the resume's field vs the job's field (e.g., "Your resume is built around data science and machine learning, but this role is a Sales Manager position focused on client acquisition and revenue targets. These are fundamentally different career paths.")
- End with a constructive suggestion like "Consider updating your resume to highlight relevant transferable skills, or look for roles that better align with your background."
- Do NOT just repeat the low score — explain the career-level mismatch in plain English.

Rules for scoring:
- 85-100: Excellent match — resume covers nearly all JD requirements
- 70-84: Good match — most requirements met, some gaps
- 50-69: Partial match — significant gaps in skills or experience
- 0-49: Poor match — major misalignment

Always include exactly these feedback sections (in order):
1. "Keyword Match" — How well the resume's terminology aligns with the JD (semantic, not just literal)
2. "Experience Alignment" — Years of experience, seniority level, and role relevance
3. "Skills & Qualifications" — Technical skills, certifications, education match
4. "Impact & Achievements" — Whether the resume demonstrates measurable results relevant to the role

For missedKeywords: list 3-8 specific skills/tools/qualifications from the JD that are missing or underrepresented in the resume. Use lowercase.

Be honest and calibrated — don't inflate scores. A generic resume against a specific JD should score 40-55, not 70+.`;

  const userMessage = `JOB DESCRIPTION:\n${jdText}\n\n---\n\nRESUME:\n${resumeText}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
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
    console.error("ATS Score API error:", err);
    const status = err.status || 500;
    return res
      .status(status)
      .json({ error: err.message || "Failed to score resume" });
  }
}
