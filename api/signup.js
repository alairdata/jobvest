import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    let userId;

    // Create user via admin API with email_confirm: true
    // This skips Supabase's built-in confirmation email
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name || "" },
    });

    if (createError) {
      // Handle duplicate email — if unverified, resend verification email
      if (createError.message?.includes("already been registered")) {
        // Look up the existing user
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingUser = users?.find((u) => u.email === email);

        if (existingUser) {
          // Block if this is a Google account
          if (existingUser.app_metadata?.provider === "google") {
            return res.status(409).json({ error: "This email is linked to a Google account. Please sign in with Google." });
          }

          // Check if they've verified via our custom flow
          const { data: profile } = await supabase
            .from("profiles")
            .select("email_verified")
            .eq("id", existingUser.id)
            .maybeSingle();

          if (!profile?.email_verified) {
            // Update password in case they forgot it
            await supabase.auth.admin.updateUserById(existingUser.id, {
              password,
              user_metadata: { full_name: name || existingUser.user_metadata?.full_name || "" },
            });

            // Resend verification — fall through to token generation below
            userId = existingUser.id;
          } else {
            return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
          }
        } else {
          return res.status(409).json({ error: "An account with this email already exists" });
        }
      } else {
        throw createError;
      }
    }

    if (!userId) userId = userData.user.id;

    // Generate verification token for Resend email
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Delete any existing tokens for this user
    await supabase.from("verification_tokens").delete().eq("user_id", userId);

    // Store token
    const { error: insertError } = await supabase
      .from("verification_tokens")
      .insert({ user_id: userId, token, expires_at: expiresAt });

    if (insertError) throw insertError;

    // Build verification link
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:5173";

    const verifyUrl = `${baseUrl}?verify_token=${token}`;

    // Send verification email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "JobVest <no-reply@jobvest.me>",
        to: email,
        subject: "Verify your JobVest account",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0;">
                <span style="color: #3b82f6;">Job</span><span>Vest</span>
              </h1>
            </div>
            <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px; text-align: center;">
              Verify your email
            </h2>
            <p style="font-size: 14px; color: #64748b; line-height: 1.6; text-align: center; margin: 0 0 28px;">
              Hey${name ? ` ${name}` : ""}! Click the button below to confirm your email and activate your account.
            </p>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 10px;">
                Verify my email
              </a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
              This link expires in 24 hours. If you didn't create a JobVest account, you can safely ignore this email.
            </p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json().catch(() => ({}));
      console.warn("Failed to send verification email:", err);
    }

    return res.status(200).json({ success: true, userId });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err.message || "Signup failed" });
  }
}
