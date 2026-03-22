import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body || {};

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Look up the token
    const { data: tokenRow, error: lookupError } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (!tokenRow) {
      return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    // Check expiry
    if (new Date(tokenRow.expires_at) < new Date()) {
      // Clean up expired token
      await supabase.from("verification_tokens").delete().eq("id", tokenRow.id);
      return res.status(400).json({ error: "Verification link has expired. Please request a new one." });
    }

    // Mark email as confirmed at the Supabase auth level (so sign-in works)
    const { error: authError } = await supabase.auth.admin.updateUserById(
      tokenRow.user_id,
      { email_confirm: true }
    );
    if (authError) throw authError;

    // Mark profile as verified
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_verified: true, updated_at: new Date().toISOString() })
      .eq("id", tokenRow.user_id);

    if (updateError) throw updateError;

    // Delete the used token
    await supabase.from("verification_tokens").delete().eq("id", tokenRow.id);

    return res.status(200).json({ success: true, userId: tokenRow.user_id });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ error: err.message || "Verification failed" });
  }
}
