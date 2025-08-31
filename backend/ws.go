package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Adjust for production
		return true
	},
}

func handleTerminalWS(w http.ResponseWriter, r *http.Request) {
	// Require auth for PTY access
	claims, err := parseTokenFromRequest(r)
	if err != nil || claims == nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer conn.Close()

	ptySession, err := startLoginShell()
	if err != nil {
		log.Println("pty start:", err)
		return
	}
	defer ptySession.Fd.Close()

	// Client -> PTY
	go func() {
		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				ptySession.Fd.Close()
				return
			}
			ptySession.Fd.Write(data)
		}
	}()

	// PTY -> Client
	buf := make([]byte, 4096)
	for {
		n, err := ptySession.Fd.Read(buf)
		if err != nil {
			return
		}
		if err := conn.WriteMessage(websocket.BinaryMessage, buf[:n]); err != nil {
			return
		}
	}
}
