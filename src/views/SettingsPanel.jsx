import { useState, useEffect } from "react";

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-[44px] h-[24px] rounded-full cursor-pointer border-none transition-colors duration-200 ${
      enabled ? "bg-brand" : "bg-stone-200"
    }`}
  >
    <span
      className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-[left] duration-200 ${
        enabled ? "left-[23px]" : "left-[3px]"
      }`}
    />
  </button>
);

const EXTENSION_ID = "YOUR_EXTENSION_ID"; // Replace after loading unpacked extension

const SettingsPanel = ({
  onClose,
  profile,
  notifications,
  tailorsUsed,
  tailorsMax,
  onUpdateProfile,
  onUpdateNotifications,
  onClearAllData,
  isAuthenticated,
  user,
  onSignOut,
  guestMode,
}) => {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const initials = (profile.name || "?")
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2) || "?";

  const handleSaveProfile = () => {
    onUpdateProfile({ name: editName.trim(), email: editEmail.trim() });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditing(false);
  };

  const toggleNotif = (key) => {
    onUpdateNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/25 backdrop-blur-[2px]">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-none sm:max-w-[420px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)] flex flex-col overflow-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between py-5 px-4 sm:px-6 border-b border-warm-border">
          <h2 className="font-serif text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer text-stone-400 text-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 py-6">
          {/* Account status banner */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 mb-6 py-3 px-4 rounded-xl bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-green-800">
                  Signed in
                </p>
                <p className="text-[12px] text-green-600 truncate">
                  {user?.email}
                </p>
              </div>
              <span className="text-[10px] font-bold text-green-600 tracking-wide uppercase shrink-0">
                Synced
              </span>
            </div>
          ) : guestMode ? (
            <div className="flex items-center gap-3 mb-6 py-3 px-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-amber-800">
                  Guest mode
                </p>
                <p className="text-[12px] text-amber-600">
                  Data is only saved on this device
                </p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("jobvest_guest_mode");
                  window.location.reload();
                }}
                className="py-1.5 px-3 rounded-lg border-none bg-amber-600 text-white text-[11px] font-bold cursor-pointer font-sans shrink-0"
              >
                Sign in
              </button>
            </div>
          ) : null}

          {/* Profile */}
          <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
            Profile
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-base font-bold shrink-0">
              {initials}
            </div>
            {editing ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full py-1.5 px-3 rounded-lg border border-stone-200 text-[14px] text-[#1a1a1a] font-sans focus:outline-none focus:border-brand"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full py-1.5 px-3 rounded-lg border border-stone-200 text-[13px] text-[#1a1a1a] font-sans focus:outline-none focus:border-brand"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="py-1.5 px-4 rounded-lg border-none bg-brand text-white text-xs font-semibold cursor-pointer font-sans"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="py-1.5 px-4 rounded-lg border border-stone-200 bg-white text-stone-600 text-xs font-semibold cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[#1a1a1a]">
                    {profile.name || "No name set"}
                  </p>
                  <p className="text-[13px] text-stone-500 mt-px">
                    {profile.email || user?.email || "No email set"}
                  </p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="py-1.5 px-4 rounded-lg border border-stone-200 bg-white text-stone-600 text-xs font-semibold cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  Edit
                </button>
              </>
            )}
          </div>

          {/* Subscription */}
          <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
            Subscription
          </p>
          <div className="rounded-2xl border border-warm-border p-5 mb-8">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[15px] font-bold text-[#1a1a1a]">
                  Free Plan
                </p>
                <p className="text-[13px] text-stone-500 mt-px">
                  {tailorsMax} tailors/month · Basic scoring
                </p>
              </div>
              <span className="text-[11px] font-bold text-brand tracking-[0.5px]">
                CURRENT
              </span>
            </div>

            {/* Usage bar */}
            <div className="mt-4 mb-2">
              <div className="h-[6px] rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-500"
                  style={{ width: `${(tailorsUsed / tailorsMax) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[12px] text-stone-400 mb-5">
              {tailorsUsed} of {tailorsMax} tailors used this month
            </p>

            {tailorsUsed >= tailorsMax && (
              <p className="text-[12px] text-red-500 font-semibold mb-3">
                You've used all your free tailors this month. Upgrade for unlimited!
              </p>
            )}

            <button
              onClick={() => setToast("Coming soon!")}
              className="w-full py-3.5 rounded-xl border-none cursor-pointer text-[14px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(255,140,66,0.2)]"
            >
              Upgrade to Pro — $9/mo
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2.5">
              Unlimited tailors · Priority scoring · Browser companion
            </p>
          </div>

          {/* Notifications */}
          <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
            Notifications
          </p>
          <div className="flex flex-col gap-0 mb-8">
            {[
              {
                key: "email",
                label: "Email notifications",
                desc: "Score updates and tailoring results",
              },
              {
                key: "browser",
                label: "Browser notifications",
                desc: "Job matches while you browse",
              },
              {
                key: "weekly",
                label: "Weekly digest",
                desc: "Summary of applications and scores",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4 border-b border-warm-border last:border-b-0"
              >
                <div>
                  <p className="text-[13px] font-semibold text-[#1a1a1a]">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-stone-400 mt-px">
                    {item.desc}
                  </p>
                </div>
                <Toggle
                  enabled={notifications[item.key]}
                  onToggle={() => toggleNotif(item.key)}
                />
              </div>
            ))}
          </div>

          {/* Browser Extension */}
          <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
            Browser Extension
          </p>
          <div className="rounded-2xl border border-warm-border p-5 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-[38px] h-[38px] rounded-[10px] shrink-0 bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-base">
                ◎
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-[#1a1a1a] mb-1">
                  Sync Resume to Extension
                </p>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
                  {isAuthenticated
                    ? "Your extension will auto-sync when you sign in with the same account."
                    : "Send your saved resume to the JobVest browser extension so you can score and tailor on any job page."}
                </p>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      const saved = (() => {
                        try { return JSON.parse(localStorage.getItem("jobvest_saved_resume")); } catch { return null; }
                      })();
                      if (!saved || !saved.resumeText) {
                        setToast("No saved resume found. Save your resume first.");
                        return;
                      }
                      setSyncStatus("syncing");
                      try {
                        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
                          chrome.runtime.sendMessage(
                            EXTENSION_ID,
                            { type: "SYNC_RESUME", data: { ...saved, syncDate: new Date().toLocaleDateString() } },
                            (response) => {
                              if (chrome.runtime.lastError) {
                                setSyncStatus("error");
                                setToast("Extension not found. Install the JobVest extension first.");
                                return;
                              }
                              if (response?.success) {
                                setSyncStatus("synced");
                                setToast("Resume synced to extension!");
                              } else {
                                setSyncStatus("error");
                                setToast("Sync failed. Try again.");
                              }
                            }
                          );
                        } else {
                          setSyncStatus("error");
                          setToast("Chrome extension API not available.");
                        }
                      } catch {
                        setSyncStatus("error");
                        setToast("Sync failed. Make sure the extension is installed.");
                      }
                    }}
                    disabled={syncStatus === "syncing"}
                    className={`py-2.5 px-5 rounded-xl border-none text-[13px] font-bold cursor-pointer font-sans transition-all ${
                      syncStatus === "synced"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : syncStatus === "syncing"
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                          : "bg-[#1a1a1a] text-white"
                    }`}
                    style={syncStatus === "synced" ? { border: "1.5px solid #bbf7d0" } : {}}
                  >
                    {syncStatus === "syncing" ? "Syncing..." : syncStatus === "synced" ? "✓ Synced!" : "Sync Now"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sign Out / Account */}
          {isAuthenticated && (
            <>
              <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
                Account
              </p>
              <div className="rounded-2xl border border-warm-border p-5 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a1a1a]">
                      Sign out
                    </p>
                    <p className="text-[12px] text-stone-500 mt-px">
                      Your data stays synced in the cloud
                    </p>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="py-2.5 px-5 rounded-xl border border-stone-200 bg-white text-stone-600 text-[13px] font-semibold cursor-pointer font-sans hover:bg-stone-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Danger Zone */}
          <p className="text-[10px] font-bold text-red-400 tracking-[1px] uppercase mb-4">
            Danger Zone
          </p>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
            <p className="text-[13px] font-semibold text-[#1a1a1a] mb-1">
              Clear all data
            </p>
            <p className="text-[12px] text-stone-500 mb-4">
              {isAuthenticated
                ? "This will delete your saved resume, profile, and all settings from this device and the cloud. You'll start fresh."
                : "This will delete your saved resume, profile, and all settings. You'll start fresh from onboarding."}
            </p>
            {confirmClear ? (
              <div className="flex gap-2">
                <button
                  onClick={onClearAllData}
                  className="py-2.5 px-5 rounded-xl border-none bg-red-600 text-white text-[13px] font-bold cursor-pointer font-sans"
                >
                  Yes, clear everything
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="py-2.5 px-5 rounded-xl border border-stone-200 bg-white text-stone-600 text-[13px] font-semibold cursor-pointer font-sans"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="py-2.5 px-5 rounded-xl border border-red-200 bg-white text-red-600 text-[13px] font-semibold cursor-pointer font-sans hover:bg-red-50 transition-colors"
              >
                Clear All Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] py-3 px-6 rounded-xl bg-[#1a1a1a] text-white text-[14px] font-semibold shadow-lg animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
