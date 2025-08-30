import { useEffect, useRef, forwardRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

type API = {
  write: (d: string | Uint8Array) => void;
  focus: () => void;
  fit: () => void;
  onData: (fn: (d: string) => void) => void;
  clear: () => void;
};

export default forwardRef<API, { onData: (d: string) => void }>(function TerminalView(
  { onData },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return; // prevent StrictMode double init
    inited.current = true;

    const el = containerRef.current;
    if (!el) return;

    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      scrollback: 2000,
      theme: {
        background: "#0d0208",
        foreground: "#00ff41",
        cursor: "#00ff41",
      },
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: 14,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(el);
    termRef.current = term;
    fitRef.current = fit;

    // Fit only after layout is ready (non-zero size); use requestAnimationFrame
    const safeFit = () => {
      try {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) fit.fit();
      } catch {}
    };
    const raf = requestAnimationFrame(safeFit);

    // Wire data
    const disp = term.onData(onData);

    const onResize = () => {
      // Refit only when visible and sized
      safeFit();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      try {
        disp.dispose();
      } catch {}
      try {
        termRef.current?.dispose();
      } catch {}
      termRef.current = null;
      fitRef.current = null;
      inited.current = false;
    };
  }, [onData]);

  // Expose API
  // @ts-ignore
  if (ref) {
    // @ts-ignore
    ref.current = {
      write: (d: string | Uint8Array) => termRef.current?.write(d),
      focus: () => termRef.current?.focus(),
      fit: () => {
        try {
          const el = containerRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) fitRef.current?.fit();
        } catch {}
      },
      onData: (fn: (s: string) => void) => termRef.current?.onData(fn),
      clear: () => termRef.current?.clear(),
    };
  }

  // Important: parent must give this element height
  return <div ref={containerRef} className="h-full w-full" />;
});
