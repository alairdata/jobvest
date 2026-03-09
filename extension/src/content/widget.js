export const createWidget = (onClick) => {
  const btn = document.createElement("div");
  btn.id = "jobvest-widget";
  btn.innerHTML = "&diams;";
  btn.title = "JobVest — Score this job";

  Object.assign(btn.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ff8c42, #ff6b35)",
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: "2147483646",
    boxShadow: "0 4px 16px rgba(255,140,66,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
    userSelect: "none",
  });

  // Hover effect
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 6px 20px rgba(255,140,66,0.5)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 16px rgba(255,140,66,0.4)";
  });

  // Draggable
  let isDragging = false;
  let startX, startY, startLeft, startBottom;

  btn.addEventListener("mousedown", (e) => {
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = btn.getBoundingClientRect();
    startLeft = rect.left;
    startBottom = window.innerHeight - rect.bottom;

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDragging = true;
        btn.style.right = "auto";
        btn.style.left = `${startLeft + dx}px`;
        btn.style.bottom = `${startBottom - dy}px`;
      }
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!isDragging) onClick();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Add pulse animation for job pages
  const style = document.createElement("style");
  style.textContent = `
    @keyframes jv-pulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(255,140,66,0.4); }
      50% { box-shadow: 0 4px 24px rgba(255,140,66,0.7), 0 0 0 8px rgba(255,140,66,0.1); }
    }
    #jobvest-widget { animation: jv-pulse 2s ease infinite; }
    #jobvest-widget:hover { animation: none; }
  `;
  document.head.appendChild(style);

  document.body.appendChild(btn);
  return btn;
};

export const removeWidget = () => {
  const el = document.getElementById("jobvest-widget");
  if (el) el.remove();
};
