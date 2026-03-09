import { execSync } from "child_process";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

// Clean dist
if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist, { recursive: true });

const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: "inherit", shell: true });
};

console.log("\n=== Building content script (IIFE) ===");
run("cross-env BUILD_TARGET=content npx vite build");

console.log("\n=== Building background script ===");
run("cross-env BUILD_TARGET=background npx vite build");

console.log("\n=== Building popup ===");
run("cross-env BUILD_TARGET=popup npx vite build");

// Copy static assets
console.log("\n=== Copying static assets ===");
cpSync(resolve(root, "public/icons"), resolve(dist, "icons"), { recursive: true });
cpSync(resolve(root, "src/content/content.css"), resolve(dist, "content.css"));

// Write & fix manifest
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf-8"));
manifest.background.service_worker = "background.js";
manifest.content_scripts[0].js = ["content.js"];
manifest.content_scripts[0].css = ["content.css"];
manifest.action.default_icon = {
  "16": "icons/icon16.svg",
  "32": "icons/icon32.svg",
  "48": "icons/icon48.svg",
  "128": "icons/icon128.svg",
};
manifest.icons = { ...manifest.action.default_icon };
manifest.action.default_popup = "src/popup/popup.html";
writeFileSync(resolve(dist, "manifest.json"), JSON.stringify(manifest, null, 2));

// Fix popup.html — Vite outputs absolute paths, need relative
const popupPath = resolve(dist, "src/popup/popup.html");
let popupHtml = readFileSync(popupPath, "utf-8");
popupHtml = popupHtml.replace(/src="\/popup\.js"/g, 'src="../../popup.js"');
popupHtml = popupHtml.replace(/href="\/chunks\//g, 'href="../../chunks/');
writeFileSync(popupPath, popupHtml);

console.log("\n=== Build complete! Load dist/ as unpacked extension ===");
