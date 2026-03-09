import React from "react";
import ReactDOM from "react-dom/client";
import { createWidget, removeWidget } from "./widget";
import SidebarApp from "../sidebar/SidebarApp";

let sidebarRoot = null;
let sidebarReactRoot = null;

const openSidebar = () => {
  if (sidebarRoot) return; // already open

  // Create Shadow DOM host
  sidebarRoot = document.createElement("div");
  sidebarRoot.id = "jobvest-sidebar-root";
  document.body.appendChild(sidebarRoot);

  const shadow = sidebarRoot.attachShadow({ mode: "open" });

  // Inject base styles into shadow root
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host { all: initial; font-family: 'DM Sans', system-ui, sans-serif; }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; }
    textarea { font-family: inherit; }
    @keyframes jv-spin { to { transform: rotate(360deg); } }
  `;
  shadow.appendChild(style);

  // Mount point inside shadow
  const mount = document.createElement("div");
  shadow.appendChild(mount);

  // Backdrop
  const backdrop = document.createElement("div");
  Object.assign(backdrop.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.15)",
    backdropFilter: "blur(2px)",
    zIndex: "2147483646",
  });
  backdrop.addEventListener("click", closeSidebar);
  mount.appendChild(backdrop);

  // React container
  const container = document.createElement("div");
  mount.appendChild(container);

  sidebarReactRoot = ReactDOM.createRoot(container);
  sidebarReactRoot.render(<SidebarApp onClose={closeSidebar} />);

  // Hide the widget while sidebar is open
  const widget = document.getElementById("jobvest-widget");
  if (widget) widget.style.display = "none";
};

const closeSidebar = () => {
  if (sidebarReactRoot) {
    sidebarReactRoot.unmount();
    sidebarReactRoot = null;
  }
  if (sidebarRoot) {
    sidebarRoot.remove();
    sidebarRoot = null;
  }
  // Show widget again
  const widget = document.getElementById("jobvest-widget");
  if (widget) widget.style.display = "flex";
};

// Initialize
createWidget(openSidebar);
