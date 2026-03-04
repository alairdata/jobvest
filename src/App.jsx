import { useState, useEffect } from "react";
import { applications } from "./data/applications";
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
import SidebarOverlay from "./views/SidebarOverlay";
import SettingsPanel from "./views/SettingsPanel";

const App = () => {
  const [mode, setMode] = useState("fix");
  const [tab, setTab] = useState("home");
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [quickTailorJD, setQuickTailorJD] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [resumeFeedback, setResumeFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [appStatuses, setAppStatuses] = useState(
    applications.map((a) => a.status)
  );

  // ATS scoring state
  const [jdText, setJdText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState(null);

  // Improve resume state
  const [resumeText, setResumeText] = useState("");
  const [improving, setImproving] = useState(false);
  const [improvedResumeUrl, setImprovedResumeUrl] = useState(null);
  const [improvedScore, setImprovedScore] = useState(null);
  const [improvedFeedback, setImprovedFeedback] = useState(null);
  const [candidateName, setCandidateName] = useState("");

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

  const sidebarTailor = useTailor();
  const quickTailor = useTailor();

  const updateStatus = (idx, newStatus) => {
    setAppStatuses((prev) => {
      const n = [...prev];
      n[idx] = newStatus;
      return n;
    });
    setOpenMenu(null);
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
  };

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
    sidebarTailor.reset();
  };

  const handleImproveResume = async () => {
    if (improving || !resumeText) return;

    setImproving(true);
    // Clean up previous improved URL
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

      // Store candidate name for download filename
      if (data.name) setCandidateName(data.name);

      // Generate PDF from structured response
      const pdfUrl = generateResumePdf(data);
      setImprovedResumeUrl(pdfUrl);

      // Fetch the generated PDF blob to extract text for rescoring
      const pdfRes = await fetch(pdfUrl);
      const pdfBlob = await pdfRes.blob();
      const pdfFile = new File([pdfBlob], "improved-resume.pdf", {
        type: "application/pdf",
      });
      const { text: improvedText, pageCount } = await parseResume(pdfFile);
      const result = analyzeResume(improvedText, pageCount);

      setImprovedScore(result.score);
      setImprovedFeedback(result.feedback);
    } catch (err) {
      console.error("Failed to improve resume:", err);
      alert(`Failed to improve resume: ${err.message}`);
    } finally {
      setImproving(false);
    }
  };

  const handleImportResume = async (file) => {
    setResumeFileName(file.name);
    setResumeFile(file);
    setHasResume(true);
    // Reset improved state on new upload
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
        const result = analyzeResume(text, pageCount);
        setResumeScore(result.score);
        setResumeFeedback(result.feedback);
      } catch {
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
    // Reset improved state
    if (improvedResumeUrl) URL.revokeObjectURL(improvedResumeUrl);
    setImprovedResumeUrl(null);
    setImprovedScore(null);
    setImprovedFeedback(null);
    setResumeText("");
    setJdText("");
    setAtsScore(null);
    setAtsFeedback(null);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans text-[#1a1a1a]">
      <Header
        tab={tab}
        setTab={setTab}
        hasResume={hasResume}
        mode={mode}
        onToggleMode={handleToggleMode}
        onOpenSidebar={handleOpenSidebar}
        onOpenSettings={() => setSettingsOpen(true)}
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
          onOpenSidebar={handleOpenSidebar}
          resumeScore={resumeScore}
          resumeText={resumeText}
          jdText={jdText}
          setJdText={setJdText}
          atsScore={atsScore}
          setAtsScore={setAtsScore}
          atsFeedback={atsFeedback}
          setAtsFeedback={setAtsFeedback}
        />
      )}
      {tab === "log" && (
        <LogView
          appStatuses={appStatuses}
          updateStatus={updateStatus}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
      )}

      {sidebarOpen && (
        <SidebarOverlay
          sidebarTailor={sidebarTailor}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;
