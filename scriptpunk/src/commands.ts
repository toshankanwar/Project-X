export type CommandResult = {
    output: string;
    handled: boolean;
    private?: boolean;
    attach?: boolean;
  };
  
  const scriptPunkBanner = `
  ┌─────────────────────────────────────────────────────────────┐
  │  ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗  │
  │  ██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██╔══██╗██║   ██║████╗  ██║██║ ██╔╝  │
  │  ███████╗██║     ██████╔╝██║██████╔╝   ██║   ██████╔╝██║   ██║██╔██╗ ██║█████╔╝   │
  │  ╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   ██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗   │
  │  ███████║╚██████╗██║  ██║██║██║        ██║   ██║     ╚██████╔╝██║ ╚████║██║  ██╗  │
  │  ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝  │
  └─────────────────────────────────────────────────────────────┘
      🔥 Advanced Terminal Environment for Security Professionals 🔥
           Hack the Planet • Script your Way • Punk the System
  `.trim();
  
  export async function handleClientCommand(input: string): Promise<CommandResult> {
    const parts = input.trim().split(/\s+/);
    const cmd = (parts[0]?.toLowerCase()) || "";
    const args = parts.slice(1);
  
    switch (cmd) {
      case "help":
        return {
          handled: true,
          output:
  `${scriptPunkBanner}
  
  Available Commands:
  ═══════════════════════════════════════════════════════════════
  
  📋 GENERAL COMMANDS:
    help                    Show this help and banner
    banner                  Display ScriptPunk logo
    clear                   Clear the terminal screen
    about                   About ScriptPunk terminal
    version                 Show version information
  
  🕐 TIME & DATE:
    time                    Show current local time
    date                    Show current date
    uptime                  Show system uptime (mock)
  
  📁 FILE SYSTEM (MOCK):
    pwd                     Show current directory
    ls                      List directory contents (mock)
    whoami                  Show current user
  
  💬 TEXT OPERATIONS:
    echo <text>             Echo text back
    reverse <text>          Reverse the input text
    upper <text>            Convert text to uppercase
    lower <text>            Convert text to lowercase
    count <text>            Count characters in text
  
  🎲 FUN COMMANDS:
    joke                    Tell a random programming joke
    quote                   Display an inspiring quote
    matrix                  Matrix-style text effect
    hack <target>           Simulate hacking (for fun!)
    nmap <target>           Mock network scan
    
  🔐 SYSTEM INFO:
    sysinfo                 Show system information (mock)
    netstat                 Show network connections (mock)
    ps                      Show running processes (mock)
  
  🔑 AUTHENTICATION:
    login                   Terminal-based login to server
    logout                  Logout from server session
  
  🔌 CONNECTION:
    attach                  Attach to remote shell (after login)
    ping <host>             Ping a host (mock)
    tracert <host>          Trace route to host (mock)
  
  Type any command to get started! 🚀
  `
        };
  
      case "banner":
        return { handled: true, output: scriptPunkBanner };
  
      case "about":
        return {
          handled: true,
          output:
  `ScriptPunk Terminal v1.0.0
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🎯 Purpose: Advanced web-based terminal for security professionals
  🏗️  Built with: React + TypeScript + Xterm.js
  🔧 Features: Real-time shell access, command parsing, secure authentication
  📅 Created: 2025
  👨‍💻 Mode: Educational & Professional Use
  
  "Empowering hackers, developers, and system administrators
  with cutting-edge terminal technology." 💪`
        };
  
      case "version":
        return { handled: true, output: "ScriptPunk Terminal v1.0.0 - Build 2025.01.31" };
  
      case "clear":
        return { handled: true, output: "\x1b[2J\x1b[H" };
  
      case "time":
        return { handled: true, output: `🕐 ${new Date().toLocaleTimeString()}` };
  
      case "date":
        return { handled: true, output: `📅 ${new Date().toLocaleDateString()}` };
  
      case "uptime":
        const uptimeHours = Math.floor(Math.random() * 100 + 1);
        return { handled: true, output: `⏱️  System uptime: ${uptimeHours} hours, ${Math.floor(Math.random() * 60)} minutes` };
  
      case "pwd":
        return { handled: true, output: "/home/hackroot" };
  
      case "ls":
        return {
          handled: true,
          output:
  `📁 drwxr-xr-x  hackroot  hackroot   4096  Jan 31 02:21  .
  📁 drwxr-xr-x  root      root       4096  Jan 30 10:15  ..
  📄 -rw-------  hackroot  hackroot    220  Jan 30 10:15  .bash_history
  📄 -rw-r--r--  hackroot  hackroot   3526  Jan 30 10:15  .bashrc
  📁 drwx------  hackroot  hackroot   4096  Jan 31 01:45  .ssh
  📄 -rwxr-xr-x  hackroot  hackroot   8192  Jan 31 02:00  exploit.py
  📄 -rw-r--r--  hackroot  hackroot   1337  Jan 31 01:30  targets.txt`
        };
  
      case "whoami":
        return { handled: true, output: "hackroot" };
  
      case "echo":
        return { handled: true, output: args.join(" ") };
  
      case "reverse":
        const text = args.join(" ");
        return { handled: true, output: text ? text.split("").reverse().join("") : "Usage: reverse <text>" };
  
      case "upper":
        return { handled: true, output: args.join(" ").toUpperCase() };
  
      case "lower":
        return { handled: true, output: args.join(" ").toLowerCase() };
  
      case "count":
        const countText = args.join(" ");
        return { handled: true, output: countText ? `Character count: ${countText.length}` : "Usage: count <text>" };
  
      case "joke":
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None. That's a hardware problem! 💡",
          "Why don't hackers ever get locked out? They always find a backdoor! 🚪",
          "What's a hacker's favorite type of music? Heavy metal... because they love breaking things! 🎸",
          "Why did the developer go broke? Because he used up all his cache! 💰"
        ];
        return { handled: true, output: jokes[Math.floor(Math.random() * jokes.length)] };
  
      case "quote":
        const quotes = [
          "\"The best way to predict the future is to invent it.\" - Alan Kay",
          "\"Code is like humor. When you have to explain it, it's bad.\" - Cory House",
          "\"In order to be irreplaceable, one must always be different.\" - Coco Chanel",
          "\"The only way to do great work is to love what you do.\" - Steve Jobs",
          "\"Simplicity is the soul of efficiency.\" - Austin Freeman"
        ];
        return { handled: true, output: `💭 ${quotes[Math.floor(Math.random() * quotes.length)]}` };
  
      case "matrix":
        return {
          handled: true,
          output:
  `🟢 Wake up, Neo... 🟢
  █▀▄▀█ █▀▀█ ▀▀█▀▀ █▀▀█ ▀█▀ █ █
  █ █ █ █▄▄█   █   █▄▄▀  █  ▄▀▄
  ▀   ▀ ▀  ▀   ▀   ▀ ▀▀ ▀▀▀ ▀ ▀
  Reality is an illusion... 🔴💊🔵💊`
        };
  
      case "hack":
        const target = args[0] || "127.0.0.1";
        return {
          handled: true,
          output:
  `🔴 INITIATING HACK SEQUENCE...
  [████████████████████████████████] 100%
  
  Target: ${target}
  Status: 🔓 PWNED!
  Access: GRANTED 🚨
  Backdoor: INSTALLED ✅
  
  ⚠️  WARNING: This is a simulation for educational purposes! ⚠️`
        };
  
      case "nmap":
        const nmapTarget = args[0] || "192.168.1.1";
        return {
          handled: true,
          output:
  `🔍 Scanning ${nmapTarget}...
  
  PORT     STATE  SERVICE
  22/tcp   open   ssh
  80/tcp   open   http
  443/tcp  open   https
  3389/tcp open   ms-wbt-server
  
  Scan complete. 4 ports found.`
        };
  
      case "sysinfo":
        return {
          handled: true,
          output:
  `🖥️  SYSTEM INFORMATION
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  OS: ScriptPunk Linux 2025.1 LTS
  Kernel: 6.1.0-scriptpunk-amd64
  Uptime: 42 days, 13:37
  Memory: 16GB RAM (69% used)
  CPU: Intel i7-13700K @ 3.4GHz
  GPU: RTX 4070 Ti
  Network: Ethernet 1Gbps + WiFi 6E
  Security: All systems nominal 🔒`
        };
  
      case "netstat":
        return {
          handled: true,
          output:
  `🌐 ACTIVE CONNECTIONS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Proto  Local Address      Foreign Address    State
  TCP    0.0.0.0:22         0.0.0.0:0          LISTENING
  TCP    0.0.0.0:80         0.0.0.0:0          LISTENING
  TCP    127.0.0.1:3000     0.0.0.0:0          LISTENING
  UDP    0.0.0.0:53         *:*                ESTABLISHED`
        };
  
      case "ps":
        return {
          handled: true,
          output:
  `📋 RUNNING PROCESSES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  PID    COMMAND                CPU%   MEM%
  1      systemd               0.1    0.2
  1337   scriptpunk-terminal   2.5    4.1
  2048   node                  1.8    8.3
  4096   firefox               15.2   12.7
  8192   code                  3.4    6.9`
        };
  
      case "ping":
        const pingHost = args[0] || "google.com";
        return {
          handled: true,
          output:
  `🏓 PING ${pingHost}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  64 bytes from ${pingHost}: icmp_seq=1 ttl=64 time=12.3ms
  64 bytes from ${pingHost}: icmp_seq=2 ttl=64 time=11.8ms
  64 bytes from ${pingHost}: icmp_seq=3 ttl=64 time=13.1ms
  
  --- ping statistics ---
  3 packets transmitted, 3 received, 0% packet loss 📊`
        };
  
      case "tracert":
      case "traceroute":
        const traceHost = args[0] || "8.8.8.8";
        return {
          handled: true,
          output:
  `🗺️  Tracing route to ${traceHost}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  1    192.168.1.1      1.2ms
  2    10.0.0.1         8.4ms
  3    203.0.113.1      15.7ms
  4    ${traceHost}     23.1ms
  
  Trace complete. 🎯`
        };
  
      case "attach":
        return { handled: true, output: "[attach requested]", attach: true };
  
      default:
        return { handled: false, output: "" };
    }
  }
  