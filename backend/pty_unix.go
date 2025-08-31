//go:build !windows

package main

import (
	"os"
	"os/exec"
	"github.com/creack/pty"
)

type PtySession struct {
	Cmd *exec.Cmd
	Fd  *os.File
}

func startLoginShell() (*PtySession, error) {
	// Use /bin/bash or /bin/sh as desired
	cmd := exec.Command("/bin/bash", "-l")
	f, err := pty.Start(cmd)
	if err != nil {
		return nil, err
	}
	return &PtySession{Cmd: cmd, Fd: f}, nil
}
