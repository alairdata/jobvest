import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Save profile + usage stats before deleting
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email, is_google")
      .eq("id", userId)
      .maybeSingle();

    const { data: settings } = await supabase
      .from("user_settings")
      .select("total_tailor_count, total_improve_count")
      .eq("id", userId)
      .maybeSingle();

    await supabase.from("deleted_profiles").insert({
      user_id: userId,
      name: profile?.name || "",
      email: profile?.email || "",
      is_google: profile?.is_google || false,
      total_tailor_count: settings?.total_tailor_count || 0,
      total_improve_count: settings?.total_improve_count || 0,
    });

    // Delete user data from tables
    await supabase.from("verification_tokens").delete().eq("user_id", userId);
    await supabase.from("applications").delete().eq("user_id", userId);
    await supabase.from("resumes").delete().eq("user_id", userId);
    await supabase.from("user_settings").delete().eq("id", userId);
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete the auth user
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete account" });
  }
}
