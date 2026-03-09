import { sIcon } from "../../shared/scoring";

const FeedbackItem = ({ item, isOpen, onToggle }) => {
  const st = sIcon(item.status);

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${st.border}` }}>
      <div
        onClick={onToggle}
        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", background: st.bg }}
      >
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", fontWeight: 800, flexShrink: 0,
          border: `2px solid ${st.color}`, color: st.color,
        }}>
          {st.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>{item.section}</p>
          <p style={{ fontSize: "10px", color: "#78716c", margin: "1px 0 0" }}>{item.msg}</p>
        </div>
        <span style={{ color: "#a8a29e", fontSize: "14px", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
          &rsaquo;
        </span>
      </div>
      {isOpen && (
        <div style={{ padding: "12px 14px 12px 46px", background: "white", borderTop: `1px solid ${st.border}` }}>
          <p style={{ fontSize: "11px", color: "#57534e", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>{item.details}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;
