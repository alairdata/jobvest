import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfPreview = ({ file }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      if (cancelled) return;

      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = "";

      const dpr = window.devicePixelRatio || 2;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        if (cancelled) return;

        const containerWidth = container.clientWidth;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.style.display = "block";

        if (i > 1) {
          const divider = document.createElement("div");
          divider.style.height = "2px";
          divider.style.background = "#e7e5e4";
          container.appendChild(divider);
        }

        container.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      setLoading(false);
    };

    render().catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [file]);

  return (
    <div className="relative">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-[3px] border-stone-200 border-t-stone-500 rounded-full animate-spin" />
        </div>
      )}
      <div ref={containerRef} className={loading ? "opacity-0 h-0 overflow-hidden" : ""} />
    </div>
  );
};

export default PdfPreview;
