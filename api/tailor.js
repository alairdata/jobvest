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

  const systemPrompt = `You are an expert resume tailor. You receive a resume and a specific job description, and you rewrite the resume to maximize its ATS score for that exact role.

Your job:
1. Analyze the job description for key requirements: skills, tools, qualifications, seniority level, and industry keywords.
2. Rewrite the resume to align with the JD — emphasize relevant experience, inject missing keywords naturally, and reframe achievements to match role expectations.
3. Preserve ALL factual information: names, dates, companies, degrees, job titles, certifications. Do NOT invent new roles or companies.
4. Rewrite bullets using the X-Y-Z formula: "Accomplished [X] as measured by [Y] by doing [Z]", incorporating JD keywords.
5. Reframe the Professional Summary to directly address what this specific role requires.
6. Reorder the Skills section to lead with skills mentioned in the JD.
7. If the resume has skills/experience relevant to the JD but not emphasized, bring them forward.
8. Use standard ATS-friendly section headers: "Professional Summary", "Work Experience", "Education", "Skills".

Return ONLY valid JSON (no markdown fences, no explanation) in this exact structure:

{
  "name": "Full Name",
  "contact": "email | phone | linkedin | location",
  "sections": [
    {
      "title": "Professional Summary",
      "content": "3-5 sentence summary tailored to the specific role"
    },
    {
      "title": "Work Experience",
      "items": [
        {
          "title": "Job Title",
          "subtitle": "Company Name | Location | Start - End",
          "bullets": ["Tailored achievement bullet 1", "Tailored achievement bullet 2"]
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
- When a bullet lacks metrics, insert conservative, realistic placeholder numbers based on the role context.
- Do NOT add any markers like [*] or asterisks to bullets. Keep bullets clean.
- Focus on making the resume pass ATS screening for THIS specific job description.`;

  const userMessage = `JOB DESCRIPTION:\n${jdText}\n\n---\n\nRESUME TO TAILOR:\n${resumeText}`;

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
    console.error("Tailor API error:", err);
    const status = err.status || 500;
    return res
      .status(status)
      .json({ error: err.message || "Failed to tailor resume" });
  }
}
