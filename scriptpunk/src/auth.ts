export async function login(username: string, password: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }
  
  export async function logout() {
    await fetch("/api/logout", { method: "POST" });
  }
  
  export async function whoami() {
    const res = await fetch("/api/whoami");
    if (!res.ok) return null;
    return res.json();
  }
  