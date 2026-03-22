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

  const { userId, email, name } = req.body || {};

  if (!userId || !email) {
    return res.status(400).json({ error: "userId and email are required" });
  }

  try {
    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Delete any existing tokens for this user
    await supabase
      .from("verification_tokens")
      .delete()
      .eq("user_id", userId);

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

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "JobVest <onboarding@resend.dev>",
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
      throw new Error(err.message || "Failed to send verification email");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Send verification error:", err);
    return res.status(500).json({ error: err.message || "Failed to send verification email" });
  }
}
