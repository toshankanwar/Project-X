import { useEffect, useRef, useState } from "react";
import TerminalView from "./Terminal";
import { handleClientCommand } from "./commands";
import { login, logout, whoami } from "./auth";

// User session type [1]
type User = { user: string; roles: string[] } | null; [1]

// Prompt pieces with ANSI colors (bright cyan for user@host, bright green for cwd) and resets [2]
function makePrompt(user: User, cwd = "~"): string { [2]
  const name = user ? "hackroot" : "guest"; [1]
  const host = "ScriptPunk"; [1]
  const sym = user ? "#" : "$"; [1]
  return `\x1b[1;96m${name}@${host}\x1b[0m:\x1b[1;92m${cwd}\x1b[0m${sym} `; [2]
}

export default function App() {
  const termRef = useRef<any>(null); [1]

  // State [1]
  const [user, setUser] = useState<User>(null); [1]
  const [ws, setWs] = useState<WebSocket | null>(null); [1]
  const [connected, setConnected] = useState(false); [1]

  // Line editor state [1]
  const promptRef = useRef<string>(""); [1]
  const bufferRef = useRef<string>(""); [1]
  const readingLineRef = useRef<boolean>(false); // true when readLine/password is active [1]
  const readDisposableRef = useRef<{ dispose: () => void } | null>(null); [1]

  // Utilities to write to terminal [1]
  function write(data: string | Uint8Array) { [1]
    termRef.current?.write(data); [1]
  }
  function writeLine(line = "") { [1]
    write(line + "\r\n"); [2]
  }

  // Redraw the current input line: CR + erase to end + prompt + buffer [2]
  function redrawLine() { [2]
    const p = promptRef.current; [1]
    const b = bufferRef.current; [1]
    write("\r\x1b[K"); // carriage return + clear to end of line [2]
    write(p + b); [2]
  }

  // Prepare a fresh prompt and clear buffer [1]
  function newPrompt() { [1]
    promptRef.current = makePrompt(user); [2]
    bufferRef.current = ""; [1]
    redrawLine(); [2]
  }

  // Init: welcome text, focus, and delayed fit (no backend calls) [1][2]
  useEffect(() => {
    writeLine("Welcome to ScriptPunk Terminal"); [1]
    writeLine("Type 'help' for general commands. Type 'login' to authenticate."); [1]
    promptRef.current = makePrompt(user); [2]
    bufferRef.current = ""; [1]
    redrawLine(); [2]

    termRef.current?.focus?.(); // caret visible [1]
    const t = setTimeout(() => termRef.current?.fit?.(), 0); // fit after layout [2]
    return () => clearTimeout(t); [2]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach PTY only after explicit login [1]
  function attachPTY() { [1]
    const socket = new WebSocket(location.origin.replace(/^http/, "ws") + "/ws/term"); [2]
    socket.binaryType = "arraybuffer"; [2]

    socket.onopen = () => {
      setConnected(true); [1]
      writeLine(""); [2]
      writeLine("[PTY connected]"); [1]
      newPrompt(); [2]
    };
    socket.onmessage = (ev) => {
      if (typeof ev.data === "string") {
        write(ev.data); [1]
      } else {
        const dec = new TextDecoder(); [1]
        write(dec.decode(new Uint8Array(ev.data as ArrayBuffer))); [1]
      }
      if (!readingLineRef.current) newPrompt(); // ensure prompt after server output [2]
    };
    socket.onclose = () => {
      setConnected(false); [1]
      writeLine(""); [2]
      writeLine("[PTY disconnected]"); [1]
      newPrompt(); [2]
    };
    setWs(socket); [1]
  }

  // Terminal-based login flow (only hits backend after explicit login) [1]
  async function doLoginFlow() {
    const u = await readLine("username: "); [2]
    const p = await readPassword("password: "); [2]
    try {
      await login(u, p); [1]
      const info = await whoami(); [1]
      setUser(info); [1]
      writeLine(""); [2]
      writeLine("[login ok]"); [1]
      if (!ws) attachPTY(); // optional auto-attach [1]
    } catch {
      writeLine(""); [2]
      writeLine("[login failed]"); [1]
    } finally {
      newPrompt(); [2]
    }
  }

  async function doLogoutFlow() {
    await logout(); [1]
    setUser(null); [1]
    if (ws) {
      ws.close(); [1]
      setWs(null); [1]
    }
    writeLine(""); [2]
    writeLine("[logged out]"); [1]
    newPrompt(); [2]
  }

  // Read a line with echo via the line editor (dispose listener to prevent stuck input) [3]
  function readLine(promptText?: string): Promise<string> { [3]
    readingLineRef.current = true; [3]
    if (promptText) {
      write(promptText); // inline prompt (no newline) [2]
    }
    bufferRef.current = ""; [1]
    redrawLine(); [2]

    return new Promise((resolve) => {
      const disp = termRef.current?.onData((data: string) => { [3]
        if (data === "\r") {
          write("\r\n"); [2]
          disp?.dispose(); [3]
          readDisposableRef.current = null; [3]
          readingLineRef.current = false; [3]
          const value = bufferRef.current; [1]
          bufferRef.current = ""; [1]
          resolve(value); [3]
          return; [3]
        }
        if (data === "\u007F") {
          if (bufferRef.current.length > 0) {
            bufferRef.current = bufferRef.current.slice(0, -1); [1]
            redrawLine(); [2]
          }
          return; [3]
        }
        if (data >= " " && data !== "\x7F") {
          bufferRef.current += data; [1]
          redrawLine(); [2]
        }
      });
      readDisposableRef.current = disp || null; [3]
    });
  }

  // Read password (masked) [3]
  function readPassword(promptText?: string): Promise<string> { [3]
    readingLineRef.current = true; [3]
    if (promptText) {
      write(promptText); [2]
    }
    bufferRef.current = ""; [1]
    redrawLine(); [2]
    return new Promise((resolve) => {
      const disp = termRef.current?.onData((data: string) => { [3]
        if (data === "\r") {
          write("\r\n"); [2]
          disp?.dispose(); [3]
          readDisposableRef.current = null; [3]
          readingLineRef.current = false; [3]
          const value = bufferRef.current; [1]
          bufferRef.current = ""; [1]
          resolve(value); [3]
          return; [3]
        }
        if (data === "\u007F") {
          if (bufferRef.current.length > 0) {
            bufferRef.current = bufferRef.current.slice(0, -1); [1]
            write("\r\x1b[K"); [2]
            write(promptRef.current + "*".repeat(bufferRef.current.length)); [2]
          }
          return; [3]
        }
        if (data >= " " && data !== "\x7F") {
          bufferRef.current += data; [1]
          write("\r\x1b[K"); [2]
          write(promptRef.current + "*".repeat(bufferRef.current.length)); [2]
        }
      });
      readDisposableRef.current = disp || null; [3]
    });
  }

  // Main keystroke handler using the line editor (single echo path) [3]
  async function handleData(d: string) { [3]
    if (readingLineRef.current) return; // prompts capture input [3]

    if (d === "\r") {
      write("\r\n"); [2]
      const input = bufferRef.current.trim(); // normalized tokenization [2]
      bufferRef.current = ""; [1]
      await dispatch(input); [1]
      return; [1]
    }
    if (d === "\u007F") {
      if (bufferRef.current.length > 0) {
        bufferRef.current = bufferRef.current.slice(0, -1); [1]
      }
      redrawLine(); [2]
      return; [1]
    }
    if (d >= " " && d !== "\x7F") {
      bufferRef.current += d; [1]
      redrawLine(); [2]
    }
  }

  // Dispatcher: client-first; server only after login/attach [1]
  async function dispatch(input: string) { [1]
    if (input === "") {
      newPrompt(); [2]
      return; [1]
    }

    if (input === "login") {
      await doLoginFlow(); [1]
      return; [1]
    }
    if (input === "logout") {
      await doLogoutFlow(); [1]
      return; [1]
    }

    // Always try client commands first (no WS/login required) [1]
    const res = await handleClientCommand(input); [1]
    if (res.handled) {
      if (res.output) writeLine(res.output); [1]
      if (res.attach) {
        if (user) {
          if (!ws || !connected) attachPTY(); [1]
        } else {
          writeLine("Login first, then run 'attach'."); [1]
        }
      }
      newPrompt(); [2]
      return; [1]
    }

    // Forward to shell only when PTY is connected [1]
    if (ws && connected) {
      ws.send(input + "\n"); [1]
      newPrompt(); [2]
      return; [1]
    }

    // Helpful hint when not connected; client commands still work [1]
    writeLine("Unknown or unavailable. Try 'help'. For shell commands: 'login' then 'attach'."); [1]
    newPrompt(); [2]
  }

  // Full-screen container; TerminalView must safe-fit in parent [2]
  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "#0d0208", color: "#00ff41" }}>
      <main className="flex-1 min-h-0 min-w-0">
        <TerminalView onData={handleData} ref={termRef} />
      </main>
    </div>
  ); [2]
}
