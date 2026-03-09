const LOGO_SVG = `<svg width="24" height="29" viewBox="0 0 64 78" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#fff" opacity="0.85"/>
  <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#fff" opacity="0.85"/>
  <path d="M24 20 L20 16" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>
  <path d="M40 20 L44 16" stroke="#93c5fd" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="44" r="2.2" fill="#fff"/>
  <circle cx="32" cy="52" r="2.2" fill="#fff"/>
  <circle cx="32" cy="60" r="2.2" fill="#fff"/>
</svg>`;

export const createWidget = (onClick) => {
  const btn = document.createElement("div");
  btn.id = "jobvest-widget";
  btn.innerHTML = LOGO_SVG;
  btn.title = "JobVest — Tailor your resume for this job";

  Object.assign(btn.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: "2147483646",
    boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
    userSelect: "none",
  });

  // Hover effect
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 6px 20px rgba(59,130,246,0.5)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 16px rgba(59,130,246,0.4)";
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

  // Pulse animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes jv-pulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(59,130,246,0.4); }
      50% { box-shadow: 0 4px 24px rgba(59,130,246,0.6), 0 0 0 8px rgba(59,130,246,0.1); }
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
