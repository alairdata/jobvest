import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useTailor } from "./hooks/useTailor";
import { parseResume } from "./utils/parseResume";
import { analyzeResume } from "./utils/analyzeResume";
import { scoreATS } from "./utils/atsScoring";
import { generateResumePdf } from "./utils/generatePdf";
import Header from "./components/Header";
import OnboardingView from "./views/OnboardingView";
import FixView from "./views/FixView";
import LaunchView from "./views/LaunchView";
import LogView from "./views/LogView";
import SettingsPanel from "./views/SettingsPanel";
import AuthView from "./views/AuthView";
import CompanionPage from "./views/CompanionPage";
import * as sync from "./lib/sync";

const STORAGE_KEY = "jobvest_saved_resume";
const SETTINGS_KEY = "jobvest_settings";
const GUEST_KEY = "jobvest_guest_mode";

const defaultSettings = {
  profile: { name: "", email: "" },
  notifications: { email: true, browser: false, weekly: true },
  tailorCount: 0,
  tailorResetMonth: new Date().toISOString().slice(0, 7),
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw);
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (parsed.tailorResetMonth !== currentMonth) {
      parsed.tailorCount = 0;
      parsed.tailorResetMonth = currentMonth;
    }
    return { ...defaultSettings, ...parsed };
  } catch { return { ...defaultSettings }; }
};

const AppContent = () => {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [guestMode, setGuestMode] = useState(
    () => localStorage.getItem(GUEST_KEY) === "true"
  );
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);

  // Restore saved resume from localStorage on initial load
  const saved = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const [mode, setMode] = useState("fix");
  const [tab, setTab] = useState("home");
  const [hasResume, setHasResume] = useState(!!saved);
  const [resumeFileName, setResumeFileName] = useState(saved?.resumeFileName || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [quickTailorJD, setQuickTailorJD] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [resumeScore, setResumeScore] = useState(saved?.resumeScore ?? null);
  const [resumeFeedback, setResumeFeedback] = useState(saved?.resumeFeedback ?? null);
  const [analyzing, setAnalyzing] = useState(false);
  const [savedToProfile, setSavedToProfile] = useState(!!saved);
  const [userApplications, setUserApplications] = useState([]);
  const [appStatuses, setAppStatuses] = useState([]);

  // ATS scoring state
  const [jdText, setJdText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [atsJobTitle, setAtsJobTitle] = useState("");
  const [atsCompany, setAtsCompany] = useState("");

  // Improve resume state
  const [resumeText, setResumeText] = useState(saved?.resumeText || "");
  const [improving, setImproving] = useState(false);
  const [improvedResumeUrl, setImprovedResumeUrl] = useState(null);
  const [improvedScore, setImprovedScore] = useState(null);
  const [improvedFeedback, setImprovedFeedback] = useState(null);
  const [candidateName, setCandidateName] = useState(saved?.candidateName || "");

  // Tailored resume state
  const [tailoredResumeUrl, setTailoredResumeUrl] = useState(null);
  const [tailoredCandidateName, setTailoredCandidateName] = useState("");
  const [tailoredAtsScore, setTailoredAtsScore] = useState(null);

  // Settings state
  const [settings, setSettings] = useState(loadSettings);

  // ── Sync from Supabase when user signs in ──
  useEffect(() => {
    if (!isAuthenticated || !user || cloudLoaded) return;

    const loadCloudData = async () => {
      setCloudLoading(true);
      try {
        // First, push any existing local data for new users
        await sync.pushLocalDataToCloud(user.id);

        // Then pull everything from cloud
        const data = await sync.pullAllData(user.id);

        // Apply profile
        if (data.profile) {
          const profilePatch = {
            name: data.profile.name || "",
            email: data.profile.email || user.email || "",
          };
          setSettings((prev) => {
            const next = { ...prev, profile: profilePatch };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
            return next;
          });
          if (data.profile.name) setCandidateName(data.profile.name);
        }

        // Apply settings
        if (data.settings) {
          const currentMonth = new Date().toISOString().slice(0, 7);
          const count = data.settings.tailor_reset_month === currentMonth
            ? data.settings.tailor_count
            : 0;
          setSettings((prev) => {
            const next = {
              ...prev,
              notifications: data.settings.notifications || prev.notifications,
              tailorCount: count,
              tailorResetMonth: currentMonth,
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
            return next;
          });
        }

        // Apply resume
        if (data.resume) {
          setResumeText(data.resume.resume_text || "");
          setResumeFileName(data.resume.file_name || "");
          setResumeScore(data.resume.score ?? null);
          setResumeFeedback(data.resume.feedback ?? null);
          setCandidateName(data.resume.candidate_name || "");
          setHasResume(true);
          setSavedToProfile(true);

          // Cache in localStorage too
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            resumeText: data.resume.resume_text,
            resumeFileName: data.resume.file_name,
            resumeScore: data.resume.score,
            resumeFeedback: data.resume.feedback,
            candidateName: data.resume.candidate_name,
            savedAt: Date.now(),
          }));
        }

        // Apply applications
        if (data.applications && data.applications.length > 0) {
          const apps = data.applications.map((a) => ({
            id: a.id,
            role: a.role,
            company: a.company,
            status: a.status,
            date: a.date,
            ats: a.ats_score,
            platform: a.platform,
          }));
          setUserApplications(apps);
          setAppStatuses(apps.map((a) => a.status));
        }
      } catch (err) {
        console.warn("Failed to sync from cloud:", err);
      } finally {
        setCloudLoading(false);
        setCloudLoaded(true);
      }
    };

    loadCloudData();
  }, [isAuthenticated, user, cloudLoaded]);

  // Reset cloud state on sign out
  useEffect(() => {
    if (!isAuthenticated) {
      setCloudLoaded(false);
    }
  }, [isAuthenticated]);

  const updateSettings = (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));

      // Sync to cloud
      if (isAuthenticated && user) {
        if (patch.profile) {
          sync.updateProfile(user.id, {
            name: patch.profile.name,
            email: patch.profile.email,
          }).catch(console.warn);
        }
        if (patch.notifications || patch.tailorCount !== undefined) {
          sync.updateSettings(user.id, {
            notifications: next.notifications,
            tailor_count: next.tailorCount,
            tailor_reset_month: next.tailorResetMonth,
          }).catch(console.warn);
        }
      }

      return next;
    });
  };

  // Clean up object URL when file changes
  useEffect(() => {
    if (resumeFile) {
      const url = URL.createObjectURL(resumeFile);
      setResumeFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setResumeFileUrl(null);
    }
  }, [resumeFile]);

  // Clean up improved resume blob URL
  useEffect(() => {
    return () => {
      if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    };
  }, [improvedResumeUrl]);

  // Clean up tailored resume blob URL
  useEffect(() => {
    return () => {
      if (tailoredResumeUrl) URL.revokeObjectURL(tailoredResumeUrl);
    };
  }, [tailoredResumeUrl]);

  const quickTailor = useTailor();

  const updateStatus = (idx, newStatus) => {
    setAppStatuses((prev) => {
      const n = [...prev];
      n[idx] = newStatus;
      return n;
    });
    setOpenMenu(null);

    // Sync status change to cloud
    if (isAuthenticated && user && userApplications[idx]?.id) {
      sync.updateApplicationStatus(userApplications[idx].id, newStatus)
        .catch(console.warn);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "fix" ? "launch" : "fix");
    setTab("home");
    quickTailor.reset();
    setQuickTailorJD(false);
    setExpandedFeedback(null);
    setJdText("");
    setAtsScore(null);
    setAtsFeedback(null);
    setAtsJobTitle("");
    setAtsCompany("");
    if (tailoredResumeUrl) URL.revokeObjectURL(tailoredResumeUrl);
    setTailoredResumeUrl(null);
    setTailoredAtsScore(null);
  };

  const handleMarkApplied = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const newApp = {
      role: atsJobTitle || "Untitled Role",
      company: atsCompany || "Unknown",
      status: "applied",
      date: dateStr,
      ats: tailoredAtsScore ?? atsScore ?? 0,
      platform: "Pasted",
    };
    setUserApplications((prev) => [newApp, ...prev]);
    setAppStatuses((prev) => ["applied", ...prev]);

    // Sync to cloud
    if (isAuthenticated && user) {
      sync.addApplication(user.id, newApp).then((saved) => {
        // Update the local app with the cloud ID
        setUserApplications((prev) => {
          const copy = [...prev];
          copy[0] = { ...copy[0], id: saved.id };
          return copy;
        });
      }).catch(console.warn);
    }
  };

  const handleImproveResume = async () => {
    if (improving || !resumeText) return;

    setImproving(true);
    if (improvedResumeUrl) {
      URL.revokeObjectURL(improvedResumeUrl);
      setImprovedResumeUrl(null);
    }
    setImprovedScore(null);
    setImprovedFeedback(null);

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          feedback: resumeFeedback,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      if (data.name) setCandidateName(data.name);

      const pdfUrl = generateResumePdf(data);
      setImprovedResumeUrl(pdfUrl);

      const textParts = [];
      if (data.name) textParts.push(data.name);
      if (data.contact) textParts.push(data.contact);
      for (const section of data.sections || []) {
        textParts.push(`\n${section.title}`);
        if (section.content) textParts.push(section.content);
        if (section.items) {
          for (const item of section.items) {
            if (item.title) textParts.push(item.title);
            if (item.subtitle) textParts.push(item.subtitle);
            if (item.bullets) {
              for (const bullet of item.bullets) {
                textParts.push(`• ${bullet}`);
              }
            }
          }
        }
      }
      const improvedText = textParts.join("\n");
      const pageCount = Math.ceil(improvedText.length / 3000) || 1;
      console.log("Improved text length:", improvedText.length, "pages:", pageCount);
      const result = analyzeResume(improvedText, pageCount);
      console.log("Improved score:", result.score, "feedback items:", result.feedback.length);

      setImprovedScore(result.score);
      setImprovedFeedback(result.feedback);
    } catch (err) {
      console.error("Failed to improve resume:", err);
      alert(`Failed to improve resume: ${err.message}`);
    } finally {
      setImproving(false);
    }
  };

  const TAILORS_MAX = 3;

  const handleTailorResume = async () => {
    if (!resumeText || !jdText.trim()) return;
    if (settings.tailorCount >= TAILORS_MAX) return;

    if (tailoredResumeUrl) {
      URL.revokeObjectURL(tailoredResumeUrl);
      setTailoredResumeUrl(null);
    }
    setTailoredAtsScore(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      if (data.name) setTailoredCandidateName(data.name);

      const pdfUrl = generateResumePdf(data);
      setTailoredResumeUrl(pdfUrl);

      const textParts = [];
      if (data.name) textParts.push(data.name);
      if (data.contact) textParts.push(data.contact);
      for (const section of data.sections || []) {
        textParts.push(`\n${section.title}`);
        if (section.content) textParts.push(section.content);
        if (section.items) {
          for (const item of section.items) {
            if (item.title) textParts.push(item.title);
            if (item.subtitle) textParts.push(item.subtitle);
            if (item.bullets) {
              for (const bullet of item.bullets) {
                textParts.push(`• ${bullet}`);
              }
            }
          }
        }
      }
      const tailoredText = textParts.join("\n");

      const scoreRes = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: tailoredText, jdText }),
      });

      if (scoreRes.ok) {
        const scoreData = await scoreRes.json();
        setTailoredAtsScore(scoreData.score);
      }

      updateSettings({ tailorCount: settings.tailorCount + 1 });
    } catch (err) {
      console.error("Failed to tailor resume:", err);
      throw err;
    }
  };

  const handleSaveResume = () => {
    const data = {
      resumeText,
      resumeFileName,
      resumeScore,
      resumeFeedback,
      candidateName,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedToProfile(true);

    // Sync to cloud
    if (isAuthenticated && user) {
      sync.upsertResume(user.id, {
        resume_text: resumeText,
        file_name: resumeFileName,
        score: resumeScore,
        feedback: resumeFeedback,
        candidate_name: candidateName,
      }).catch(console.warn);
    }
  };

  const handleUnsaveResume = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedToProfile(false);
    setHasResume(false);
    setMode("fix");
    setResumeScore(null);
    setResumeFeedback(null);
    setResumeText("");
    setResumeFileName("");
    setResumeFile(null);
    if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    setImprovedResumeUrl(null);
    setImprovedScore(null);
    setImprovedFeedback(null);

    // Delete from cloud
    if (isAuthenticated && user) {
      sync.deleteResume(user.id).catch(console.warn);
    }
  };

  const handleImportResume = async (file) => {
    setSavedToProfile(false);
    setResumeFileName(file.name);
    setResumeFile(file);
    setHasResume(true);
    if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    setImprovedResumeUrl(null);
    setImprovedScore(null);
    setImprovedFeedback(null);
    if (file.type === "application/pdf") {
      setAnalyzing(true);
      setResumeScore(null);
      setResumeFeedback(null);
      try {
        const { text, pageCount } = await parseResume(file);
        setResumeText(text);
        console.log("Original text length:", text.length, "pages:", pageCount);
        const result = analyzeResume(text, pageCount);
        console.log("Original score:", result.score, "feedback items:", result.feedback.length);
        setResumeScore(result.score);
        setResumeFeedback(result.feedback);
      } catch (err) {
        console.error("Resume analysis failed:", err);
        setResumeScore(null);
        setResumeFeedback(null);
        setResumeText("");
      } finally {
        setAnalyzing(false);
      }
    } else {
      setResumeScore(null);
      setResumeFeedback(null);
      setResumeText("");
    }
  };

  const handleResetResume = () => {
    setHasResume(false);
    setMode("fix");
    setExpandedFeedback(null);
    if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    setImprovedResumeUrl(null);
    setImprovedScore(null);
    setImprovedFeedback(null);
    setResumeText("");
    setJdText("");
    setAtsScore(null);
    setAtsFeedback(null);
    if (tailoredResumeUrl) URL.revokeObjectURL(tailoredResumeUrl);
    setTailoredResumeUrl(null);
    setTailoredAtsScore(null);
  };

  const handleClearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    setSettings({ ...defaultSettings });
    setSavedToProfile(false);
    setHasResume(false);
    setMode("fix");
    setTab("home");
    setResumeScore(null);
    setResumeFeedback(null);
    setResumeText("");
    setResumeFileName("");
    setResumeFile(null);
    if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    setImprovedResumeUrl(null);
    setImprovedScore(null);
    setImprovedFeedback(null);
    if (tailoredResumeUrl) URL.revokeObjectURL(tailoredResumeUrl);
    setTailoredResumeUrl(null);
    setTailoredAtsScore(null);
    setSettingsOpen(false);

    // Clear cloud data too
    if (isAuthenticated && user) {
      sync.deleteResume(user.id).catch(console.warn);
      sync.updateSettings(user.id, {
        notifications: defaultSettings.notifications,
        tailor_count: 0,
        tailor_reset_month: new Date().toISOString().slice(0, 7),
      }).catch(console.warn);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem(GUEST_KEY);
      setCloudLoaded(false);
      setGuestMode(false);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleSkipAuth = () => {
    localStorage.setItem(GUEST_KEY, "true");
    setGuestMode(true);
  };

  // Derive profile name: settings > saved resume > user email > empty
  const profileName = settings.profile.name || candidateName || user?.user_metadata?.full_name || "";

  // Show auth screen if not authenticated and not in guest mode
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-navy to-brand-deep flex items-center justify-center text-white text-lg font-bold animate-pulse">
            ✧
          </div>
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !guestMode) {
    return <AuthView onSkip={handleSkipAuth} />;
  }

  // Show loading overlay while syncing cloud data
  if (isAuthenticated && cloudLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-navy to-brand-deep flex items-center justify-center text-white text-lg font-bold animate-pulse">
            ✧
          </div>
          <p className="text-sm text-stone-400">Syncing your data...</p>
        </div>
      </div>
    );
  }

  if (companionOpen) {
    return <CompanionPage onBack={() => setCompanionOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[#1a1a1a]">
      <Header
        tab={tab}
        setTab={setTab}
        hasResume={hasResume}
        mode={mode}
        onToggleMode={handleToggleMode}
        onOpenSettings={() => setSettingsOpen(true)}
        user={user}
        isAuthenticated={isAuthenticated}
        profileName={profileName}
      />

      {tab === "home" && !hasResume && (
        <OnboardingView onImport={handleImportResume} />
      )}
      {tab === "home" && hasResume && mode === "fix" && (
        <FixView
          expandedFeedback={expandedFeedback}
          setExpandedFeedback={setExpandedFeedback}
          onReset={handleResetResume}
          setMode={setMode}
          resumeFileName={resumeFileName}
          resumeFile={resumeFile}
          resumeFileUrl={resumeFileUrl}
          resumeFileType={resumeFile?.type}
          resumeScore={resumeScore}
          resumeFeedback={resumeFeedback}
          analyzing={analyzing}
          improving={improving}
          improvedResumeUrl={improvedResumeUrl}
          improvedScore={improvedScore}
          improvedFeedback={improvedFeedback}
          candidateName={candidateName}
          onImproveResume={handleImproveResume}
          onUpdateResume={handleImportResume}
          resumeText={resumeText}
          onSaveResume={handleSaveResume}
          onUnsaveResume={handleUnsaveResume}
          savedToProfile={savedToProfile}
        />
      )}
      {tab === "home" && hasResume && mode === "launch" && (
        <LaunchView
          setMode={setMode}
          setHasResume={setHasResume}
          setTab={setTab}
          quickTailorJD={quickTailorJD}
          setQuickTailorJD={setQuickTailorJD}
          quickTailor={quickTailor}
          expandedFeedback={expandedFeedback}
          setExpandedFeedback={setExpandedFeedback}
          onOpenCompanion={() => setCompanionOpen(true)}
          resumeScore={improvedScore ?? resumeScore}
          resumeText={resumeText}
          jdText={jdText}
          setJdText={setJdText}
          atsScore={atsScore}
          setAtsScore={setAtsScore}
          atsFeedback={atsFeedback}
          setAtsFeedback={setAtsFeedback}
          onTailorResume={handleTailorResume}
          tailoredResumeUrl={tailoredResumeUrl}
          tailoredCandidateName={tailoredCandidateName}
          tailoredAtsScore={tailoredAtsScore}
          onMarkApplied={handleMarkApplied}
          setAtsJobTitle={setAtsJobTitle}
          setAtsCompany={setAtsCompany}
          applications={userApplications}
        />
      )}
      {tab === "log" && (
        <LogView
          applications={userApplications}
          appStatuses={appStatuses}
          updateStatus={updateStatus}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          onClose={() => setSettingsOpen(false)}
          profile={{ ...settings.profile, name: profileName }}
          notifications={settings.notifications}
          tailorsUsed={settings.tailorCount}
          tailorsMax={TAILORS_MAX}
          onUpdateProfile={(profile) => updateSettings({ profile })}
          onUpdateNotifications={(notifications) => updateSettings({ notifications })}
          onClearAllData={handleClearAllData}
          isAuthenticated={isAuthenticated}
          user={user}
          onSignOut={handleSignOut}
          guestMode={guestMode}
        />
      )}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
