import { getATSMeta } from "../../shared/scoring";

const ATSResultCard = ({ before, after }) => {
  const metaBefore = getATSMeta(before);
  const metaAfter = getATSMeta(after);
  const isSpam = metaAfter.color === "#dc2626";

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "10px",
    border: `1px solid ${isSpam ? "#fecaca" : "#bbf7d0"}`,
    background: isSpam ? "#fef2f2" : "#f0fdf4",
  };

  return (
    <div>
      <div style={containerStyle}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "9px", color: "#78716c", marginBottom: "2px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Before</p>
          <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: "monospace", color: metaBefore.color }}>{before}%</span>
          <p style={{ fontSize: "9px", fontWeight: 600, marginTop: "2px", color: metaBefore.color }}>{metaBefore.label}</p>
        </div>
        <span style={{ fontSize: "20px", alignSelf: "center", color: metaAfter.color }}>&rarr;</span>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "9px", color: "#78716c", marginBottom: "2px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>After</p>
          <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: "monospace", color: metaAfter.color }}>{after}%</span>
          <p style={{ fontSize: "9px", fontWeight: 600, marginTop: "2px", color: metaAfter.color }}>{metaAfter.label}</p>
        </div>
      </div>
      <p style={{ fontSize: "9px", color: "#a8a29e", textAlign: "center" }}>
        ATS Score measures keyword match against this specific job description
      </p>
    </div>
  );
};

export default ATSResultCard;
