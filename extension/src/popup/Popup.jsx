import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const STORAGE_KEY_RESUME = "jobvest_resume";
const STORAGE_KEY_APPS = "jobvest_applications";

const Popup = () => {
  const [resume, setResume] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY_RESUME, STORAGE_KEY_APPS], (result) => {
      setResume(result[STORAGE_KEY_RESUME] || null);
      setApps(result[STORAGE_KEY_APPS] || []);
    });
  }, []);

  const s = {
    container: { padding: "20px", minHeight: "200px" },
    header: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
    logo: { width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #ff8c42, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 700 },
    title: { fontSize: "16px", fontWeight: 700 },
    brand: { color: "#ff8c42" },
    section: { fontSize: "10px", fontWeight: 700, color: "#a8a29e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", marginTop: "16px" },
    card: { padding: "12px", borderRadius: "10px", background: "#fefcf9", border: "1px solid #f0ece6", marginBottom: "8px" },
    link: { display: "block", textAlign: "center", fontSize: "11px", color: "#ff8c42", fontWeight: 600, textDecoration: "none", marginTop: "16px" },
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.logo}>&diams;</div>
        <span style={s.title}>
          <span style={s.brand}>Job</span>Vest
        </span>
      </div>

      {/* Resume status */}
      <p style={s.section}>Resume</p>
      <div style={s.card}>
        {resume ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>&#128196;</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: 600 }}>{resume.resumeFileName || "Resume"}</p>
              <p style={{ fontSize: "10px", color: "#a8a29e", marginTop: "2px" }}>
                Synced {resume.syncDate || "recently"}
              </p>
            </div>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a" }} />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <p style={{ fontSize: "12px", color: "#78716c" }}>No resume synced</p>
            <p style={{ fontSize: "10px", color: "#a8a29e", marginTop: "4px" }}>
              Open JobVest and click "Sync to Extension"
            </p>
          </div>
        )}
      </div>

      {/* Recent scores */}
      {apps.length > 0 && (
        <>
          <p style={s.section}>Recent Jobs</p>
          {apps.slice(0, 3).map((app, i) => (
            <div key={i} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600 }}>{app.role}</p>
                <p style={{ fontSize: "10px", color: "#a8a29e" }}>{app.company} &middot; {app.date}</p>
              </div>
              {app.ats && (
                <span style={{
                  fontSize: "11px", fontWeight: 700, fontFamily: "monospace",
                  color: app.ats >= 85 ? "#16a34a" : app.ats >= 50 ? "#d97706" : "#dc2626",
                }}>
                  {app.ats}%
                </span>
              )}
            </div>
          ))}
        </>
      )}

      <a href="https://jobvest.vercel.app" target="_blank" rel="noopener noreferrer" style={s.link}>
        Open JobVest &rarr;
      </a>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("popup-root")).render(<Popup />);
