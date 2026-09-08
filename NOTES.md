## Note1: gnome keyring
Below
```json
  "mounts": [
    "source=${localEnv:HOME}/.claude,target=/home/vscode/.claude,type=bind",
    "source=${localEnv:HOME}/.claude.json,target=/home/vscode/.claude.json,type=bind"
  ],
  "containerEnv": {
    "CLAUDE_CONFIG_DIR": "/home/vscode/.claude"
  }
```
does not work, the token is stored elsewhere (not in `.claude/.credentials.json`), probably in gnome keyring.