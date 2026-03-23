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
  improveCount: 0,
  totalTailorCount: 0,
  totalImproveCount: 0,
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
      parsed.improveCount = 0;
      parsed.tailorResetMonth = currentMonth;
    }
    return { ...defaultSettings, ...parsed };
  } catch { return { ...defaultSettings }; }
};

const AppContent = () => {
  const { user, isAuthenticated, loading: authLoading, signOut, deleteAccount, emailVerified, verifyToken, resendVerification } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  // Clear any existing guest mode on load — guest mode is no longer supported
  useEffect(() => {
    localStorage.removeItem(GUEST_KEY);
  }, []);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);

  // Restore saved resume from localStorage on initial load
  const saved = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const [mode, setMode] = useState(() => {
    const path = window.location.pathname;
    if (path === "/score") return "launch";
    return "fix";
  });
  const [tab, setTab] = useState(() => {
    const path = window.location.pathname;
    if (path === "/log") return "log";
    return "home";
  });
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

  // Email verification resend state
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

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
          const isSameMonth = data.settings.tailor_reset_month === currentMonth;
          const tailorCount = isSameMonth ? data.settings.tailor_count : 0;
          const improveCount = isSameMonth ? (data.settings.improve_count || 0) : 0;
          setSettings((prev) => {
            const next = {
              ...prev,
              notifications: data.settings.notifications || prev.notifications,
              tailorCount: tailorCount,
              improveCount: improveCount,
              totalTailorCount: data.settings.total_tailor_count || 0,
              totalImproveCount: data.settings.total_improve_count || 0,
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
        if (patch.notifications || patch.tailorCount !== undefined || patch.improveCount !== undefined || patch.totalTailorCount !== undefined || patch.totalImproveCount !== undefined) {
          sync.updateSettings(user.id, {
            notifications: next.notifications,
            tailor_count: next.tailorCount,
            improve_count: next.improveCount || 0,
            total_tailor_count: next.totalTailorCount || 0,
            total_improve_count: next.totalImproveCount || 0,
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
      updateSettings({ improveCount: (settings.improveCount || 0) + 1, totalImproveCount: (settings.totalImproveCount || 0) + 1 });
    } catch (err) {
      console.error("Failed to improve resume:", err);
      alert(`Failed to improve resume: ${err.message}`);
    } finally {
      setImproving(false);
    }
  };

  const handleTailorResume = async () => {
    if (!resumeText || !jdText.trim()) return;

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

      updateSettings({ tailorCount: settings.tailorCount + 1, totalTailorCount: (settings.totalTailorCount || 0) + 1 });
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

    // Sync to browser extension (if installed)
    try {
      if (chrome?.runtime?.sendMessage) {
        // Try known extension IDs — the extension listens via onMessageExternal
        const extData = { resumeText, resumeFileName, resumeScore, resumeFeedback, candidateName, syncDate: Date.now() };
        chrome.runtime.sendMessage("kphpofikfphenkfheilcnpmphkliepjc", { type: "SYNC_RESUME", data: extData }, () => {
          if (chrome.runtime.lastError) { /* extension not installed, ignore */ }
        });
      }
    } catch { /* not in Chrome or extension not available */ }
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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      setCloudLoaded(false);
      setGuestMode(false);
      setHasResume(false);
      setResumeText("");
      setResumeFileName("");
      setResumeScore(null);
      setResumeFeedback(null);
      setCandidateName("");
      setSettings({ ...defaultSettings });
      setUserApplications([]);
      setAppStatuses([]);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(GUEST_KEY);
      setCloudLoaded(false);
      setGuestMode(false);
      setSettings({ ...defaultSettings });
      setHasResume(false);
      setResumeText("");
      setResumeFileName("");
      setResumeFile(null);
      setResumeFileUrl(null);
      setResumeScore(null);
      setResumeFeedback(null);
      setCandidateName("");
      setSavedToProfile(false);
      setImprovedResumeUrl(null);
      setImprovedScore(null);
      setImprovedFeedback(null);
      setAtsScore(null);
      setAtsFeedback(null);
      setJdText("");
      setUserApplications([]);
      setAppStatuses([]);
    } catch (err) {
      console.error("Delete account failed:", err);
      alert(`Failed to delete account: ${err.message}`);
    }
  };

  const handleSkipAuth = () => {
    localStorage.setItem(GUEST_KEY, "true");
    setGuestMode(true);
  };

  // Derive profile name: settings > saved resume > user email > empty
  const profileName = settings.profile.name || user?.user_metadata?.full_name || candidateName || "";

  // Capture verify token at render time (before any effect can strip the URL)
  const [verifyTokenFromUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("verify_token");
  });
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    if (!verifyTokenFromUrl || verifying || verifySuccess) return;

    // Already verified — just clean the URL and move on
    if (emailVerified === true) {
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    // Wait until we know the verification status (null = still checking)
    if (isAuthenticated && emailVerified === null) return;

    setVerifying(true);
    verifyToken(verifyTokenFromUrl)
      .then(() => {
        setVerifySuccess(true);
        window.history.replaceState({}, "", window.location.pathname);
      })
      .catch((err) => {
        setVerifyError(err.message);
        window.history.replaceState({}, "", window.location.pathname);
      })
      .finally(() => setVerifying(false));
  }, [emailVerified]);

  // Update URL based on current view
  useEffect(() => {
    if (authLoading) return;
    // Don't replace URL while verify token is being processed
    if (verifyTokenFromUrl && !verifySuccess && !verifyError) return;
    let path;
    if (!isAuthenticated && !guestMode) {
      path = "/sign-in";
    } else if (isAuthenticated && emailVerified === false && !verifySuccess && !guestMode) {
      path = "/verify";
    } else if (tab === "home" && !hasResume) {
      path = "/get-started";
    } else if (tab === "home" && hasResume && mode === "fix") {
      path = "/review";
    } else if (tab === "home" && hasResume && mode === "launch") {
      path = "/score";
    } else if (tab === "log") {
      path = "/log";
    } else {
      path = "/";
    }
    if (window.location.pathname !== path) {
      window.history.replaceState({}, "", path);
    }
  }, [authLoading, isAuthenticated, guestMode, tab, hasResume, mode, emailVerified]);

  // Show auth screen if not authenticated and not in guest mode
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !guestMode) {
    return <AuthView onSkip={handleSkipAuth} verifySuccess={verifySuccess} verifying={verifying} verifyError={verifyError} />;
  }

  // Still checking email verification status — show loading
  if (isAuthenticated && emailVerified === null && !guestMode) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show verification pending screen for unverified email users
  // Skip if we just verified in this session (verifySuccess) — emailVerified state catches up
  if (isAuthenticated && emailVerified === false && !verifySuccess && !guestMode) {
    const handleResend = async () => {
      setResending(true);
      try {
        await resendVerification();
        setResent(true);
      } catch (err) {
        console.error("Resend failed:", err);
      } finally {
        setResending(false);
      }
    };

    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", overflow: "hidden" }}>
        <style>{`
          @keyframes envDrop { from { opacity:0; transform:translateY(-30px) scale(0.85); } to { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes spPop { from { opacity:0; transform:scale(0); } to { opacity:1; transform:scale(1); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "420px", width: "90vw", textAlign: "center", padding: "48px 24px" }}>
          {/* Envelope */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "36px", animation: "envDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s both", cursor: "pointer" }}>
            <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
              <ellipse cx="70" cy="105" rx="42" ry="5" fill="#dbeafe" opacity="0.7"/>
              <rect x="8" y="28" width="124" height="72" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
              <path d="M8 96 L70 64 L132 96" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1"/>
              <path d="M8 28 L70 64" stroke="#bfdbfe" strokeWidth="1" fill="none"/>
              <path d="M132 28 L70 64" stroke="#bfdbfe" strokeWidth="1" fill="none"/>
              <path d="M8 28 Q70 0 132 28 L70 58 Z" fill="#1d4ed8"/>
              <path d="M30 24 Q70 8 110 24" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <rect x="36" y="10" width="68" height="52" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
              <rect x="46" y="20" width="48" height="4" rx="2" fill="#bfdbfe"/>
              <rect x="46" y="29" width="38" height="3" rx="1.5" fill="#e0eeff"/>
              <rect x="46" y="36" width="42" height="3" rx="1.5" fill="#e0eeff"/>
              <rect x="46" y="43" width="30" height="3" rx="1.5" fill="#e0eeff"/>
              <circle cx="108" cy="28" r="14" fill="#2563eb"/>
              <path d="M102 28l4 4.5 8-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ position: "absolute", top: "2px", right: "-18px", pointerEvents: "none", animation: "spPop 0.4s ease 0.8s both" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v4M10 14v4M2 10h4M14 10h4M4.3 4.3l2.8 2.8M12.9 12.9l2.8 2.8M4.3 15.7l2.8-2.8M12.9 7.1l2.8-2.8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="2.5" fill="#3b82f6"/>
              </svg>
            </div>
            <div style={{ position: "absolute", top: "30px", left: "-20px", pointerEvents: "none", animation: "spPop 0.4s ease 1s both" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v3M7 10v3M1 7h3M10 7h3M2.8 2.8l2 2M9.2 9.2l2 2M2.8 11.2l2-2M9.2 4.8l2-2" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ position: "absolute", bottom: "8px", right: "-14px", pointerEvents: "none", animation: "spPop 0.4s ease 1.2s both" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v2.5M6 8.5v2.5M1 6h2.5M8.5 6H11M2.8 2.8l1.5 1.5M7.7 7.7l1.5 1.5M2.8 9.2l1.5-1.5M7.7 4.3l1.5-1.5" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {verifySuccess ? (
            <>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "10px", animation: "fadeUp 0.6s ease 0.4s both" }}>
                Email verified!
              </h1>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 300, color: "#16a34a", lineHeight: 1.8, marginBottom: "32px", animation: "fadeUp 0.6s ease 0.5s both" }}>
                Your account is ready.
              </p>
              <button
                onClick={() => { window.location.href = "/"; }}
                style={{
                  fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 600,
                  padding: "14px 36px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer",
                  animation: "fadeUp 0.6s ease 0.6s both",
                }}
              >
                Continue to JobVest
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: "10px", animation: "fadeUp 0.6s ease 0.4s both" }}>
                Verify your email
              </h1>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 300, color: "#64748b", lineHeight: 1.8, marginBottom: "32px", maxWidth: "340px", animation: "fadeUp 0.6s ease 0.5s both" }}>
                We dropped a link in your inbox.<br />Open it to activate your JobVest account.
              </p>

              {/* Email box */}
              <div style={{
                width: "100%", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px",
                padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "28px", animation: "fadeUp 0.6s ease 0.6s both",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "9px", background: "#dbeafe",
                  border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
                    <rect x="0.5" y="0.5" width="16" height="12" rx="3" stroke="#1d4ed8" strokeWidth="1.2"/>
                    <path d="M0.5 3l8 5.5 8-5.5" stroke="#1d4ed8" strokeWidth="1.2" fill="none"/>
                  </svg>
                </div>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px" }}>
                    Sent to
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e3a8a" }}>
                    {user?.email}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1d4ed8", animation: "blink 1.8s ease infinite" }} />
                  <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: 600 }}>Sent</span>
                </div>
              </div>

              {/* Steps */}
              <div style={{ width: "100%", marginBottom: "28px", animation: "fadeUp 0.6s ease 0.7s both" }}>
                {[
                  { num: 1, active: true, title: "Open the email", desc: "Check your inbox or spam folder" },
                  { num: 2, active: false, title: "Click the confirmation link", desc: "It'll bring you right back" },
                  { num: 3, active: false, title: "You're in", desc: "Start building your profile" },
                ].map((step) => (
                  <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "13px 0", borderBottom: step.num < 3 ? "1px solid #f1f5f9" : "none", textAlign: "left" }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "1px",
                      background: step.active ? "#dbeafe" : "#f1f5f9",
                      border: step.active ? "1px solid #93c5fd" : "1px solid #e2e8f0",
                      color: step.active ? "#1d4ed8" : "#94a3b8",
                    }}>
                      {step.num}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: step.active ? "#0f172a" : "#94a3b8", marginBottom: "2px" }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 300, color: "#94a3b8" }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {verifyError && (
                <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500, marginBottom: "16px" }}>{verifyError}</p>
              )}

              {/* Resend button */}
              <button
                onClick={handleResend}
                disabled={resending || resent}
                style={{
                  fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 600,
                  color: resent ? "#16a34a" : "#1d4ed8",
                  cursor: resending || resent ? "default" : "pointer",
                  background: "none", border: "none", marginBottom: "16px",
                  animation: "fadeUp 0.5s ease 0.85s both",
                }}
              >
                {resent ? "Verification email sent!" : resending ? "Sending..." : "Resend verification email"}
              </button>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: "'Sora', sans-serif", fontSize: "13px", fontWeight: 500, color: "#94a3b8",
                  background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#1d4ed8"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
              >
                &larr; Sign out
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show loading overlay while syncing cloud data
  if (isAuthenticated && cloudLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-sm text-stone-400">Loading...</p>
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
          atsJobTitle={atsJobTitle}
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
          onUpdateProfile={(profile) => updateSettings({ profile })}
          onUpdateNotifications={(notifications) => updateSettings({ notifications })}
          onClearAllData={handleClearAllData}
          isAuthenticated={isAuthenticated}
          user={user}
          onSignOut={handleSignOut}
          onDeleteAccount={handleDeleteAccount}
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
