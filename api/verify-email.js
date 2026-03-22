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
      // Token already used or doesn't exist — check if user is already verified
      // (handles case where user clicks link twice)
      return res.status(400).json({ error: "Invalid or expired verification link. If you already verified, try signing in." });
    }

    console.log("Verify: found token for user", tokenRow.user_id);

    // Check expiry
    if (new Date(tokenRow.expires_at) < new Date()) {
      await supabase.from("verification_tokens").delete().eq("id", tokenRow.id);
      return res.status(400).json({ error: "Verification link has expired. Please request a new one." });
    }

    // Step 1: Mark email as confirmed at the Supabase auth level (so sign-in works)
    const { error: authError } = await supabase.auth.admin.updateUserById(
      tokenRow.user_id,
      { email_confirm: true }
    );
    if (authError) {
      console.error("Verify: Supabase auth confirm failed:", authError);
      throw authError;
    }
    console.log("Verify: Supabase auth confirmed for", tokenRow.user_id);

    // Step 2: Mark profile as verified in our profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_verified: true, updated_at: new Date().toISOString() })
      .eq("id", tokenRow.user_id);

    if (updateError) {
      console.error("Verify: profile update failed:", updateError);
      throw updateError;
    }
    console.log("Verify: profile marked verified for", tokenRow.user_id);

    // Step 3: Delete the used token
    await supabase.from("verification_tokens").delete().eq("id", tokenRow.id);

    return res.status(200).json({ success: true, userId: tokenRow.user_id });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ error: err.message || "Verification failed" });
  }
}
