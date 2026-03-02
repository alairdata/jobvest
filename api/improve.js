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
        .map((f) => `- ${f.section}: ${f.msg}`)
        .join("\n")
    : "";

  const systemPrompt = `You are a professional resume rewriter. You receive raw resume text and feedback about weaknesses.

Your job:
1. Preserve ALL factual information: names, dates, companies, degrees, job titles, certifications.
2. Rewrite bullet points using strong action verbs and quantified results (X-Y-Z formula).
3. Fix all spelling and grammar errors.
4. Use standard ATS-friendly section headers: "Professional Summary", "Work Experience", "Education", "Skills".
5. Return ONLY valid JSON (no markdown fences, no explanation) in this exact structure:

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
- If a metric can be reasonably inferred (e.g., "managed a team" → "Managed a team of X"), keep it vague rather than fabricating specific numbers.`;

  const userMessage = `Here is the resume text to improve:\n\n---\n${resumeText}\n---\n\n${feedbackSummary ? `Feedback from analysis:\n${feedbackSummary}` : ""}`;

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
