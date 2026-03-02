import { useState } from "react";

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

const SettingsPanel = ({ onClose }) => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [browserNotif, setBrowserNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const tailorsUsed = 1;
  const tailorsMax = 3;

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
          {/* Profile */}
          <p className="text-[10px] font-bold text-stone-400 tracking-[1px] uppercase mb-4">
            Profile
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-base font-bold shrink-0">
              PK
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[#1a1a1a]">
                Princilla Koranteng
              </p>
              <p className="text-[13px] text-stone-500 mt-px">
                princilla0871@gmail.com
              </p>
            </div>
            <button className="py-1.5 px-4 rounded-lg border border-stone-200 bg-white text-stone-600 text-xs font-semibold cursor-pointer hover:bg-stone-50 transition-colors">
              Edit
            </button>
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

            <button className="w-full py-3.5 rounded-xl border-none cursor-pointer text-[14px] font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_2px_12px_rgba(255,140,66,0.2)]">
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
          <div className="flex flex-col gap-0">
            {[
              {
                label: "Email notifications",
                desc: "Score updates and tailoring results",
                enabled: emailNotif,
                toggle: () => setEmailNotif(!emailNotif),
              },
              {
                label: "Browser notifications",
                desc: "Job matches while you browse",
                enabled: browserNotif,
                toggle: () => setBrowserNotif(!browserNotif),
              },
              {
                label: "Weekly digest",
                desc: "Summary of applications and scores",
                enabled: weeklyDigest,
                toggle: () => setWeeklyDigest(!weeklyDigest),
              },
            ].map((item, i) => (
              <div
                key={i}
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
                <Toggle enabled={item.enabled} onToggle={item.toggle} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
