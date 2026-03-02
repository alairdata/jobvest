import { getStrengthMeta, getATSMeta } from "../utils/scoring";

const ScoreGauge = ({ value, sz = 200, type = "strength" }) => {
  const meta = type === "strength" ? getStrengthMeta(value) : getATSMeta(value);
  const r = 80;
  const circ = Math.PI * r;
  const off = circ - (value / 100) * circ;
  const cx = sz / 2;
  const baseline = r + 16;
  const svgH = baseline + 8;

  return (
    <div className="mx-auto mt-3 mb-1 text-center">
      <svg
        width={sz}
        height={svgH}
        viewBox={`0 0 ${sz} ${svgH}`}
        className="block mx-auto"
      >
        <path
          d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
          fill="none"
          stroke={meta.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 2px 8px ${meta.color}44)`,
          }}
        />
      </svg>
      <div className="-mt-14 pb-2">
        <span
          className="text-5xl font-extrabold font-serif leading-none"
          style={{ color: meta.color }}
        >
          {value}
        </span>
        <p
          className="text-[11px] font-bold mt-1 tracking-[1.5px] font-mono"
          style={{ color: meta.color }}
        >
          {meta.label}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;
