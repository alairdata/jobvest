import { getStrengthMeta, getATSMeta } from "../../shared/scoring";

const ScoreGauge = ({ value, sz = 180, type = "ats" }) => {
  const meta = type === "strength" ? getStrengthMeta(value) : getATSMeta(value);
  const r = 70;
  const circ = Math.PI * r;
  const off = circ - (value / 100) * circ;
  const cx = sz / 2;
  const baseline = r + 14;
  const svgH = baseline + 8;

  return (
    <div style={{ textAlign: "center", margin: "12px auto 4px" }}>
      <svg width={sz} height={svgH} viewBox={`0 0 ${sz} ${svgH}`} style={{ display: "block", margin: "0 auto" }}>
        <path
          d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${baseline} A ${r} ${r} 0 0 1 ${cx + r} ${baseline}`}
          fill="none"
          stroke={meta.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 2px 8px ${meta.color}44)`,
          }}
        />
      </svg>
      <div style={{ marginTop: "-50px", paddingBottom: "8px" }}>
        <span style={{ fontSize: "42px", fontWeight: 800, color: meta.color, fontFamily: "Georgia, serif", lineHeight: 1 }}>
          {value}
        </span>
        <p style={{ fontSize: "10px", fontWeight: 700, marginTop: "4px", letterSpacing: "1.5px", fontFamily: "monospace", color: meta.color }}>
          {meta.label}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;
