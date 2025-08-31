import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

type API = {
  write: (d: string | Uint8Array) => void;
  focus: () => void;
  fit: () => void;
  onData: (fn: (d: string) => void) => { dispose: () => void };
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
    if (inited.current) return;
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
        cursorAccent: "#00ff41",
      },
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      fontSize: 18,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      fontWeight: "normal",
      cursorStyle: "block",
      cursorWidth: 2,
      cols: 80,
      rows: 24,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    fitRef.current = fit;

    term.open(el);
    termRef.current = term;

    // Safe fit function - removed private _core property access
    const safeFit = () => {
      try {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          fit.fit();
          term.focus();
        }
      } catch (e) {
        console.warn('Fit failed:', e);
      }
    };

    // Multiple timing strategies for fit
    setTimeout(safeFit, 0);
    setTimeout(safeFit, 100);
    const raf = requestAnimationFrame(safeFit);

    // Wire data with proper disposal handling
    const disp = term.onData(onData);

    // Fixed resize handling with proper browser typing
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        safeFit();
      }, 200);
    };

    window.addEventListener("resize", onResize);

    // Focus the terminal initially to ensure cursor is visible
    setTimeout(() => {
      term.focus();
    }, 0);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      try {
        disp?.dispose();
      } catch {}
      try {
        termRef.current?.dispose();
      } catch {}
      termRef.current = null;
      fitRef.current = null;
      inited.current = false;
    };
  }, [onData]);

  // Use useImperativeHandle for better ref handling
  useImperativeHandle(ref, () => ({
    write: (d: string | Uint8Array) => {
      termRef.current?.write(d);
      // Force cursor refresh after write
      setTimeout(() => termRef.current?.focus(), 0);
    },
    focus: () => {
      termRef.current?.focus();
      // Also refresh cursor position - with null check
      if (termRef.current) {
        termRef.current.refresh(termRef.current.buffer.active.cursorY, termRef.current.buffer.active.cursorY);
      }
    },
    fit: () => {
      try {
        const el = containerRef.current;
        if (!el || !termRef.current) return;
        
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          fitRef.current?.fit();
          // Ensure cursor stays visible after fit
          setTimeout(() => {
            termRef.current?.focus();
            if (termRef.current) {
              termRef.current.refresh(termRef.current.buffer.active.cursorY, termRef.current.buffer.active.cursorY);
            }
          }, 0);
        }
      } catch (e) {
        console.warn('Manual fit failed:', e);
      }
    },
    onData: (fn: (s: string) => void) => {
      return termRef.current?.onData(fn) || { dispose: () => {} };
    },
    clear: () => {
      termRef.current?.clear();
      // Ensure cursor is visible after clear
      setTimeout(() => termRef.current?.focus(), 0);
    },
  }), []);

  // Important: parent must give this element height
  return <div ref={containerRef} className="h-full w-full" />;
});
