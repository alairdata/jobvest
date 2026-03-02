import { getATSMeta } from "../utils/scoring";

const ATSResultCard = ({ before, after }) => {
  const metaBefore = getATSMeta(before);
  const metaAfter = getATSMeta(after);
  const isSpam = metaAfter.color === "#dc2626";

  return (
    <div>
      <div
        className={`flex justify-center gap-6 p-[18px] rounded-xl mb-2.5 border ${
          isSpam
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
        }`}
      >
        <div className="text-center">
          <p className="text-[9px] text-stone-500 mb-0.5 font-mono uppercase tracking-[1px]">
            Before
          </p>
          <span
            className="text-[28px] font-bold font-mono"
            style={{ color: metaBefore.color }}
          >
            {before}%
          </span>
          <p
            className="text-[9px] font-semibold mt-0.5"
            style={{ color: metaBefore.color }}
          >
            {metaBefore.label}
          </p>
        </div>
        <span
          className="text-xl self-center"
          style={{ color: metaAfter.color }}
        >
          →
        </span>
        <div className="text-center">
          <p className="text-[9px] text-stone-500 mb-0.5 font-mono uppercase tracking-[1px]">
            After
          </p>
          <span
            className="text-[28px] font-bold font-mono"
            style={{ color: metaAfter.color }}
          >
            {after}%
          </span>
          <p
            className="text-[9px] font-semibold mt-0.5"
            style={{ color: metaAfter.color }}
          >
            {metaAfter.label}
          </p>
        </div>
      </div>

      {after >= 95 && (
        <div className="p-2.5 px-3.5 rounded-[10px] bg-red-50 border border-red-200 flex gap-2 items-start mb-2.5">
          <span className="text-sm shrink-0">⚠️</span>
          <p className="text-[10px] text-red-900 leading-relaxed">
            <strong>Spam risk:</strong> ATS scores above 95% can look like
            keyword stuffing to recruiters. We've kept it in the 80-85% safe
            zone for natural readability.
          </p>
        </div>
      )}

      <p className="text-[9px] text-stone-400 text-center">
        🤖 ATS Score measures keyword match against this specific job
        description
      </p>
    </div>
  );
};

export default ATSResultCard;
