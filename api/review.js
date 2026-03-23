import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, rating, subject, feedback } = req.body || {};

  if (!userId || !rating) {
    return res.status(400).json({ error: "userId and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const { error } = await supabase.from("reviews").insert({
      user_id: userId,
      rating,
      subject: subject || "",
      feedback: feedback || "",
    });

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Review submit error:", err);
    return res.status(500).json({ error: err.message || "Failed to submit review" });
  }
}
