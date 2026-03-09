import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const target = process.env.BUILD_TARGET;

const configs = {
  content: defineConfig({
    plugins: [react()],
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    build: {
      outDir: "dist",
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, "src/content/content.jsx"),
        name: "JobVestContent",
        formats: ["iife"],
        fileName: () => "content.js",
      },
    },
  }),

  background: defineConfig({
    build: {
      outDir: "dist",
      emptyOutDir: false,
      rollupOptions: {
        input: { background: resolve(__dirname, "src/background/background.js") },
        output: { entryFileNames: "[name].js" },
      },
    },
  }),

  popup: defineConfig({
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: false,
      rollupOptions: {
        input: { popup: resolve(__dirname, "src/popup/popup.html") },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "chunks/[name].js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
  }),
};

export default configs[target] || configs.content;
