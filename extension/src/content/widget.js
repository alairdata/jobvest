const LOGO_SVG = `<svg width="16" height="20" viewBox="0 0 64 78" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 4 L56 16 L56 40 C56 56 44 68 32 74 C20 68 8 56 8 40 L8 16 Z" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
  <path d="M24 20 L32 38 L28 28 L20 24 Z" fill="#fff" opacity="0.9"/>
  <path d="M40 20 L32 38 L36 28 L44 24 Z" fill="#fff" opacity="0.9"/>
  <circle cx="32" cy="46" r="2.5" fill="#fff"/>
  <circle cx="32" cy="55" r="2.5" fill="#fff"/>
</svg>`;

export const createWidget = (onClick) => {
  const btn = document.createElement("div");
  btn.id = "jobvest-widget";

  btn.innerHTML = `
    ${LOGO_SVG}
    <span style="font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:700;letter-spacing:-0.3px;">
      <span style="color:#93c5fd;">Job</span><span style="color:#fff;">Vest</span>
    </span>
  `;

  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    height: "38px",
    padding: "0 16px 0 12px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    zIndex: "2147483646",
    boxShadow: "0 2px 12px rgba(37,99,235,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
    userSelect: "none",
    opacity: "0.92",
  });

  // Hover
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.05)";
    btn.style.boxShadow = "0 4px 18px rgba(37,99,235,0.5)";
    btn.style.opacity = "1";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 2px 12px rgba(37,99,235,0.4)";
    btn.style.opacity = "0.92";
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

  document.body.appendChild(btn);
  return btn;
};

export const removeWidget = () => {
  const el = document.getElementById("jobvest-widget");
  if (el) el.remove();
};
