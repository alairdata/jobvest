import { useState } from "react";

const ReviewPopup = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [subject, setSubject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit({ rating, subject, feedback });
      setSubmitted(true);
      setTimeout(() => onClose(), 1800);
    } catch {
      setSubmitting(false);
    }
  };

  const activeStars = hoveredStar || rating;

  const ratingLabels = ["", "Terrible", "Poor", "Okay", "Good", "Amazing"];

  if (submitted) {
    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Sora', 'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff", borderRadius: "20px", padding: "40px 32px",
            maxWidth: "380px", width: "90vw", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: "reviewPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10084;&#65039;</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
            Thank you!
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Your feedback means a lot to us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes reviewPop { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes starBounce { 0% { transform:scale(1); } 50% { transform:scale(1.3); } 100% { transform:scale(1); } }
      `}</style>

      <div
        style={{
          background: "#fff", borderRadius: "20px", padding: "32px 28px",
          maxWidth: "400px", width: "90vw",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "reviewPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#94a3b8", fontSize: "20px", lineHeight: 1, padding: "4px",
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h3 style={{
            fontSize: "22px", fontWeight: 700, color: "#0f172a",
            margin: "0 0 6px", letterSpacing: "-0.3px",
          }}>
            How is this going?
          </h3>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
            We'd love your honest feedback
          </p>
        </div>

        {/* Stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "4px", fontSize: "36px", lineHeight: 1,
                transition: "transform 0.15s",
                transform: activeStars >= star ? "scale(1.1)" : "scale(1)",
                animation: rating === star ? "starBounce 0.3s ease" : "none",
              }}
            >
              {activeStars >= star ? (
                <span style={{ color: "#f59e0b" }}>&#9733;</span>
              ) : (
                <span style={{ color: "#e2e8f0" }}>&#9733;</span>
              )}
            </button>
          ))}
        </div>

        {/* Rating label */}
        <p style={{
          textAlign: "center", fontSize: "13px", fontWeight: 600,
          color: activeStars > 0 ? "#f59e0b" : "transparent",
          marginBottom: "20px", height: "18px",
        }}>
          {ratingLabels[activeStars] || ""}
        </p>

        {/* Subject */}
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: "1.5px solid #e2e8f0", fontSize: "13px",
            color: "#0f172a", outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", marginBottom: "10px",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
        />

        {/* Feedback */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us more... (optional)"
          rows={3}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: "1.5px solid #e2e8f0", fontSize: "13px",
            color: "#0f172a", outline: "none", fontFamily: "inherit",
            boxSizing: "border-box", resize: "vertical", marginBottom: "20px",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          style={{
            width: "100%", padding: "14px",
            borderRadius: "12px", border: "none",
            background: rating > 0
              ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
              : "#e2e8f0",
            color: rating > 0 ? "#fff" : "#94a3b8",
            fontSize: "14px", fontWeight: 700, fontFamily: "inherit",
            cursor: rating > 0 && !submitting ? "pointer" : "default",
            transition: "all 0.2s",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default ReviewPopup;
