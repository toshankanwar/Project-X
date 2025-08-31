package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
    
    "github.com/golang-jwt/jwt/v5"
    "github.com/gorilla/websocket"
)

var jwtSecret = []byte("change-this-secret")

// Structs
type LoginRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type Claims struct {
    Username string   `json:"username"`
    Roles    []string `json:"roles"`
    jwt.RegisteredClaims
}

// WebSocket upgrader
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true // Allow all origins for development
    },
}

func main() {
    // Enable CORS for all routes
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        w.WriteHeader(http.StatusNotFound)
        w.Write([]byte("API server - use React frontend on localhost:3000"))
    })

    // REST auth API endpoints
    http.HandleFunc("/api/login", corsWrapper(handleLogin))
    http.HandleFunc("/api/logout", corsWrapper(handleLogout))
    http.HandleFunc("/api/whoami", corsWrapper(handleWhoAmI))

    // PTY WebSocket (auth required)
    http.HandleFunc("/ws/term", handleTerminalWS)

    log.Println("API Server running on :8080")
    log.Println("Make sure your React app runs on :5173")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

// CORS wrapper for API endpoints
func corsWrapper(handler http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        handler(w, r)
    }
}

// JWT Token Functions
func issueToken(w http.ResponseWriter, username string, roles []string) error {
    now := time.Now()
    claims := &Claims{
        Username: username,
        Roles:    roles,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(now.Add(2 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(now),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signed, err := token.SignedString(jwtSecret)
    if err != nil {
        return err
    }
    http.SetCookie(w, &http.Cookie{
        Name:     "session",
        Value:    signed,
        Path:     "/",
        HttpOnly: true,
        Secure:   false, // set true behind TLS in production
        SameSite: http.SameSiteLaxMode,
        Expires:  now.Add(2 * time.Hour),
    })
    return nil
}

func parseTokenFromRequest(r *http.Request) (*Claims, error) {
    // 1) Cookie
    if c, err := r.Cookie("session"); err == nil {
        return parseJWT(c.Value)
    }
    // 2) Authorization: Bearer
    authz := r.Header.Get("Authorization")
    if len(authz) > 7 && authz[:7] == "Bearer " {
        return parseJWT(authz[7:])
    }
    // 3) Query
    if t := r.URL.Query().Get("token"); t != "" {
        return parseJWT(t)
    }
    return nil, http.ErrNoCookie
}

func parseJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })
    if err != nil || !token.Valid {
        return nil, err
    }
    return claims, nil
}

// Auth Handler Functions
func handleLogin(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        return
    }
    var req LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        return
    }
    // Demo auth: replace with DB check
    if req.Username == "hackroot" && req.Password == "kali" {
        if err := issueToken(w, req.Username, []string{"admin"}); err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            return
        }
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"ok":true}`))
        return
    }
    w.WriteHeader(http.StatusUnauthorized)
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
    // Expire cookie
    http.SetCookie(w, &http.Cookie{
        Name:     "session",
        Value:    "",
        Path:     "/",
        HttpOnly: true,
        Expires:  time.Unix(0, 0),
    })
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(`{"ok":true}`))
}

func handleWhoAmI(w http.ResponseWriter, r *http.Request) {
    claims, err := parseTokenFromRequest(r)
    if err != nil {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }
    type resp struct {
        User  string   `json:"user"`
        Roles []string `json:"roles"`
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(resp{User: claims.Username, Roles: claims.Roles})
}

// WebSocket handler for terminal
func handleTerminalWS(w http.ResponseWriter, r *http.Request) {
    // Check auth before upgrading to WebSocket
    _, err := parseTokenFromRequest(r)
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Upgrade to WebSocket
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("WebSocket upgrade failed:", err)
        return
    }
    defer conn.Close()

    log.Println("Terminal WebSocket connected")

    // Simple echo for now - replace with real PTY logic
    for {
        messageType, message, err := conn.ReadMessage()
        if err != nil {
            log.Println("WebSocket read error:", err)
            break
        }

        // Echo back the message (replace with real terminal logic)
        response := "hackroot@scriptpunk:~$ " + string(message) + "\nCommand executed successfully!"
        err = conn.WriteMessage(messageType, []byte(response))
        if err != nil {
            log.Println("WebSocket write error:", err)
            break
        }
    }
}
