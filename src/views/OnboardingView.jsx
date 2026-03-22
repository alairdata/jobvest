import { useRef } from "react";

const OnboardingView = ({ onImport }) => {
  const fileInputRef = useRef(null);
  const steps = [
    { icon: "📄", bg: "bg-blue-50", title: "Step 1", desc: "Import your resume", style: "grayscale" },
    { icon: "✏️", bg: "bg-violet-50", title: "Step 2", desc: "Get your Resume Strength Score and feedback on what to improve", style: "grayscale" },
    { icon: "🚀", bg: "bg-blue-50", title: "Step 3", desc: "Launch your job search with ATS-optimized, tailored resumes", style: "grayscale" },
  ];

  return (
    <div className="max-w-[860px] mx-auto py-6 sm:py-10 px-4 sm:px-6 text-center select-none cursor-default">
      <h1 className="font-heading text-2xl sm:text-[34px] font-extrabold mb-6 sm:mb-10 text-[#1a1a1a]">
        Here's how it works
      </h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center mb-12 gap-6 sm:gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="w-full sm:flex-[0_0_200px] text-center px-3">
              <div
                className={`w-[72px] h-[72px] mx-auto mb-4 ${s.bg} rounded-[18px] flex items-center justify-center text-[32px]`}
                style={{ filter: "grayscale(1)" }}
              >
                {s.icon}
              </div>
              <p className="font-heading text-lg font-extrabold mb-1.5">
                {s.title}
              </p>
              <p className="text-[13px] text-stone-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
            {i < 2 && (
              <div className="flex-[0_0_60px] hidden sm:flex items-center h-[72px]">
                <div className="w-full border-t-[2.5px] border-dashed border-stone-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImport(file);
            e.target.value = "";
          }
        }}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="py-3.5 sm:py-[18px] px-8 sm:px-12 rounded-[40px] border-none cursor-pointer text-sm sm:text-base font-bold font-sans bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_4px_20px_rgba(59,130,246,0.3),0_2px_8px_rgba(0,0,0,0.08)]"
      >
        Import my resume
      </button>
      <p className="text-xs text-stone-400 mt-3.5">
        By clicking above, you agree to our{" "}
        <span className="text-blue-600 cursor-pointer">Terms of Use</span> and{" "}
        <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default OnboardingView;
