import { supabase } from "./supabase";

// ── Profile ──

export const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId, updates) => {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
  if (error) throw error;
};

// ── Settings ──

export const fetchSettings = async (userId) => {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const updateSettings = async (userId, updates) => {
  const { error } = await supabase
    .from("user_settings")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
  if (error) throw error;
};

// ── Resume ──

export const fetchResume = async (userId) => {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const upsertResume = async (userId, resumeData) => {
  const { error } = await supabase
    .from("resumes")
    .upsert(
      { user_id: userId, ...resumeData, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) throw error;
};

export const deleteResume = async (userId) => {
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
};

// ── Applications ──

export const fetchApplications = async (userId) => {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addApplication = async (userId, app) => {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: userId,
      role: app.role,
      company: app.company,
      status: app.status,
      date: app.date,
      ats_score: app.ats,
      platform: app.platform,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateApplicationStatus = async (appId, status) => {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", appId);
  if (error) throw error;
};

// ── Full sync: pull all user data from Supabase ──

export const pullAllData = async (userId) => {
  const [profile, settings, resume, applications] = await Promise.all([
    fetchProfile(userId),
    fetchSettings(userId),
    fetchResume(userId),
    fetchApplications(userId),
  ]);
  return { profile, settings, resume, applications };
};

// ── Push localStorage data to Supabase on first sign-in ──

export const pushLocalDataToCloud = async (userId) => {
  // Push saved resume if exists locally (upsert handles duplicates gracefully)
  try {
    const raw = localStorage.getItem("jobvest_saved_resume");
    if (raw) {
      const saved = JSON.parse(raw);
      await upsertResume(userId, {
        resume_text: saved.resumeText || "",
        file_name: saved.resumeFileName || "",
        score: saved.resumeScore ?? null,
        feedback: saved.resumeFeedback ?? null,
        candidate_name: saved.candidateName || "",
      });
    }
  } catch (e) {
    console.warn("Failed to push local resume to cloud:", e);
  }

  // Push settings if exists locally
  try {
    const raw = localStorage.getItem("jobvest_settings");
    if (raw) {
      const s = JSON.parse(raw);
      const existing = await fetchSettings(userId);
      // Only push if cloud settings are default (new user)
      if (existing && !existing.updated_at) {
        await updateSettings(userId, {
          notifications: s.notifications,
          tailor_count: s.tailorCount || 0,
          improve_count: s.improveCount || 0,
          total_tailor_count: s.totalTailorCount || 0,
          total_improve_count: s.totalImproveCount || 0,
          tailor_reset_month: s.tailorResetMonth,
        });
      }
    }
  } catch (e) {
    console.warn("Failed to push local settings to cloud:", e);
  }
};
