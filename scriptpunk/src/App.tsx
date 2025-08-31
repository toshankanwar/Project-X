import { useEffect, useRef, useState } from "react";
import TerminalView from "./Terminal";
import { handleClientCommand } from "./commands";
import { login, logout, whoami } from "./auth";

// User session type
type User = { user: string; roles: string[] } | null;

// Prompt pieces with ANSI colors (bright cyan for user@host, bright green for cwd) and resets
function makePrompt(user: User, cwd = "~"): string {
  const name = user ? "hackroot" : "guest";
  const host = "ScriptPunk";
  const sym = user ? "#" : "$";
  return `\x1b[1;96m${name}@${host}\x1b[0m:\x1b[1;92m${cwd}\x1b[0m${sym} `;
}

// Loading animation frames
const loadingFrames = [
  "Loading ScriptPunk Terminal    [    ]",
  "Loading ScriptPunk Terminal    [■   ]", 
  "Loading ScriptPunk Terminal    [■■  ]",
  "Loading ScriptPunk Terminal    [■■■ ]",
  "Loading ScriptPunk Terminal    [■■■■]",
  "Loading ScriptPunk Terminal    [✓✓✓✓]"
];

// Startup animation sequences (faster delays)
const startupSequence = [
  { text: "┌─────────────────────────────────────────────────────────────┐", delay: 50 },
  { text: "│                 ScriptPunk Terminal v2.0.0                   │", delay: 50 },
  { text: "│           Advanced Security Professional Environment         │", delay: 50 },
  { text: "└─────────────────────────────────────────────────────────────┘", delay: 100 },
  { text: "", delay: 50 },
  { text: "[SYSTEM] Initializing ScriptPunk Terminal...", delay: 150 },
  { text: "[BOOT]   Loading core modules...              [████████████] 100%", delay: 200 },
  { text: "[NET]    Establishing network connections...   [████████████] 100%", delay: 200 },
  { text: "[API]    Connecting to external APIs...       [████████████] 100%", delay: 200 },
  { text: "[SEC]    Loading security protocols...        [████████████] 100%", delay: 200 },
  { text: "[CMD]    Registering 50+ commands...          [████████████] 100%", delay: 200 },
  { text: "[TERM]   Initializing terminal interface...   [████████████] 100%", delay: 200 },
  { text: "[AUTH]   Setting up authentication system...  [████████████] 100%", delay: 200 },
  { text: "[WS]     WebSocket server ready...            [████████████] 100%", delay: 150 },
  { text: "", delay: 100 },
  { text: "✓ System initialization complete!", delay: 100 },
  { text: "✓ All modules loaded successfully", delay: 100 },
  { text: "✓ APIs connected and ready", delay: 100 },
  { text: "✓ Security protocols active", delay: 100 },
  { text: "", delay: 150 },
  { text: "🔥 Welcome to ScriptPunk Terminal! 🔥", delay: 100 },
  { text: "   Hack the Planet • Script your Way • Punk the System", delay: 100 },
  { text: "", delay: 100 },
  { text: "Type 'help' for available commands or 'login' to authenticate.", delay: 50 },
  { text: "Ready for input...", delay: 100 }
];

export default function App() {
  const termRef = useRef<any>(null);

  // State
  const [user, setUser] = useState<User>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStartupComplete, setIsStartupComplete] = useState(false);

  // Line editor state
  const promptRef = useRef<string>("");
  const bufferRef = useRef<string>("");
  const readingLineRef = useRef<boolean>(false);
  const readDisposableRef = useRef<{ dispose: () => void } | null>(null);

  // Utilities to write to terminal
  function write(data: string | Uint8Array) {
    termRef.current?.write(data);
  }
  function writeLine(line = "") {
    write(line + "\r\n");
  }

  // Page loading animation
  async function showLoadingAnimation(): Promise<void> {
    return new Promise((resolve) => {
      let frameIndex = 0;
      let cycles = 0;
      const maxCycles = 2;
      
      const interval = setInterval(() => {
        write('\r\x1b[K' + loadingFrames[frameIndex]);
        
        frameIndex++;
        
        if (frameIndex >= loadingFrames.length) {
          frameIndex = 0;
          cycles++;
          
          if (cycles >= maxCycles) {
            clearInterval(interval);
            write('\r\x1b[K');
            writeLine("Loading complete! Starting terminal...");
            writeLine("");
            setTimeout(resolve, 300);
          }
        }
      }, 200);
    });
  }

  // Animated typing effect
  async function typeWriter(text: string, speed: number = 50): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          write(text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
          write("\r\n");
          resolve();
        }
      }, speed);
    });
  }

  // Startup animation with typing effect (faster)
  async function playStartupAnimation(): Promise<void> {
    for (const step of startupSequence) {
      if (step.text === "") {
        writeLine();
      } else {
        await typeWriter(step.text, 15); // Much faster typing
      }
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    setIsStartupComplete(true);
  }

  // Show help suggestions after startup
  async function showHelpSuggestions(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    writeLine("");
    writeLine("💡 Popular Commands:");
    writeLine("   • help     - See all available commands");
    writeLine("   • about    - Learn about Toshan Kanwar");
    writeLine("   • weather  - Get weather information");
    writeLine("   • crypto   - Check cryptocurrency prices");
    writeLine("   • joke     - Get programming jokes");
    writeLine("   • dhoom    - Bollywood hacking scene");
    writeLine("");
    writeLine("Start typing any command below:");
  }

  // Redraw the current input line: CR + erase to end + prompt + buffer
  function redrawLine() {
    const p = promptRef.current;
    const b = bufferRef.current;
    write("\r\x1b[K");
    write(p + b);
  }

  // Prepare a fresh prompt and clear buffer
  function newPrompt() {
    promptRef.current = makePrompt(user);
    bufferRef.current = "";
    redrawLine();
    setTimeout(() => {
      termRef.current?.focus?.();
    }, 10);
  }

  // Init: page loading, startup animation, help suggestions
  useEffect(() => {
    const initializeTerminal = async () => {
      // Clear screen first
      write("\x1b[2J\x1b[H");
      
      // Show page loading animation
      await showLoadingAnimation();
      setIsPageLoading(false);
      
      // Play startup animation
      await playStartupAnimation();
      
      // Show help suggestions
      await showHelpSuggestions();
      
      // Set up initial prompt
      promptRef.current = makePrompt(user);
      bufferRef.current = "";
      redrawLine();

      termRef.current?.focus?.();
      const t = setTimeout(() => {
        termRef.current?.fit?.();
        termRef.current?.focus?.();
      }, 100);
      
      return () => clearTimeout(t);
    };

    initializeTerminal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Force prompt refresh when user state changes
  useEffect(() => {
    if (!readingLineRef.current && isStartupComplete && !isPageLoading) {
      setTimeout(() => {
        newPrompt();
      }, 50);
    }
  }, [user, connected, isStartupComplete, isPageLoading]);

  // Attach PTY only after explicit login
  function attachPTY() {
    const socket = new WebSocket(location.origin.replace(/^http/, "ws") + "/ws/term");
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      setConnected(true);
      writeLine("");
      writeLine("[PTY connected]");
    };
    socket.onmessage = (ev) => {
      if (typeof ev.data === "string") {
        write(ev.data);
      } else {
        const dec = new TextDecoder();
        write(dec.decode(new Uint8Array(ev.data as ArrayBuffer)));
      }
      if (!readingLineRef.current) {
        setTimeout(() => {
          newPrompt();
        }, 50);
      }
    };
    socket.onclose = () => {
      setConnected(false);
      writeLine("");
      writeLine("[PTY disconnected]");
      setTimeout(() => {
        newPrompt();
      }, 50);
    };
    setWs(socket);
  }

  // Terminal-based login flow
  async function doLoginFlow() {
    const u = await readLine("username: ");
    const p = await readPassword("password: ");
    try {
      await login(u, p);
      const info = await whoami();
      setUser(info);
      writeLine("");
      writeLine("[login ok]");
      
      if (!ws) {
        setTimeout(() => {
          attachPTY();
        }, 100);
      }
    } catch {
      writeLine("");
      writeLine("[login failed]");
      setTimeout(() => {
        newPrompt();
      }, 100);
    }
  }

  async function doLogoutFlow() {
    await logout();
    setUser(null);
    if (ws) {
      ws.close();
      setWs(null);
    }
    writeLine("");
    writeLine("[logged out]");
  }

  // Read a line with echo via the line editor
  function readLine(promptText?: string): Promise<string> {
    readingLineRef.current = true;
    if (promptText) {
      write(promptText);
    }
    bufferRef.current = "";
    redrawLine();

    return new Promise((resolve) => {
      const disp = termRef.current?.onData((data: string) => {
        if (data === "\r") {
          write("\r\n");
          disp?.dispose();
          readDisposableRef.current = null;
          readingLineRef.current = false;
          const value = bufferRef.current;
          bufferRef.current = "";
          resolve(value);
          return;
        }
        if (data === "\u007F") {
          if (bufferRef.current.length > 0) {
            bufferRef.current = bufferRef.current.slice(0, -1);
            redrawLine();
          }
          return;
        }
        if (data >= " " && data !== "\x7F") {
          bufferRef.current += data;
          redrawLine();
        }
      });
      readDisposableRef.current = disp || null;
    });
  }

  // Read password (masked)
  function readPassword(promptText?: string): Promise<string> {
    readingLineRef.current = true;
    if (promptText) {
      write(promptText);
    }
    bufferRef.current = "";
    redrawLine();
    return new Promise((resolve) => {
      const disp = termRef.current?.onData((data: string) => {
        if (data === "\r") {
          write("\r\n");
          disp?.dispose();
          readDisposableRef.current = null;
          readingLineRef.current = false;
          const value = bufferRef.current;
          bufferRef.current = "";
          resolve(value);
          return;
        }
        if (data === "\u007F") {
          if (bufferRef.current.length > 0) {
            bufferRef.current = bufferRef.current.slice(0, -1);
            write("\r\x1b[K");
            write(promptRef.current + "*".repeat(bufferRef.current.length));
          }
          return;
        }
        if (data >= " " && data !== "\x7F") {
          bufferRef.current += data;
          write("\r\x1b[K");
          write(promptRef.current + "*".repeat(bufferRef.current.length));
        }
      });
      readDisposableRef.current = disp || null;
    });
  }

  // Main keystroke handler - only active after startup is complete
  async function handleData(d: string) {
    if (isPageLoading || !isStartupComplete || readingLineRef.current) return;

    if (d === "\r") {
      write("\r\n");
      const input = bufferRef.current.trim();
      bufferRef.current = "";
      await dispatch(input);
      return;
    }
    if (d === "\u007F") {
      if (bufferRef.current.length > 0) {
        bufferRef.current = bufferRef.current.slice(0, -1);
      }
      redrawLine();
      return;
    }
    if (d >= " " && d !== "\x7F") {
      bufferRef.current += d;
      redrawLine();
    }
  }

  // Dispatcher: client-first; server only after login/attach
  async function dispatch(input: string) {
    if (input === "") {
      newPrompt();
      return;
    }

    if (input === "login") {
      await doLoginFlow();
      return;
    }
    if (input === "logout") {
      await doLogoutFlow();
      return;
    }

    // Always try client commands first
    const res = await handleClientCommand(input);
    if (res.handled) {
      if (res.output) writeLine(res.output);
      if (res.attach) {
        if (user) {
          if (!ws || !connected) attachPTY();
        } else {
          writeLine("Login first, then run 'attach'.");
        }
      }
      newPrompt();
      return;
    }

    // Forward to shell only when PTY is connected
    if (ws && connected) {
      ws.send(input + "\n");
      return;
    }

    writeLine("Unknown or unavailable. Try 'help'. For shell commands: 'login' then 'attach'.");
    newPrompt();
  }

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "#0d0208", color: "#00ff41" }}>
      <main className="flex-1 min-h-0 min-w-0">
        <TerminalView onData={handleData} ref={termRef} />
      </main>
    </div>
  );
}
