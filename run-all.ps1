# run-all.ps1 — launch NEVA's three local services, each in its own window.
# Usage:  .\run-all.ps1      (from the repo root)
#
# Prereqs: Ollama running with gemma4:12b, and each sub-project's venv/node_modules
# already set up (see README.md). This only starts the servers.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

function Start-Svc($title, $dir, $cmd) {
    Write-Host "Starting $title ..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList @(
        "-NoExit", "-Command",
        "`$host.UI.RawUI.WindowTitle='$title'; Set-Location '$dir'; $cmd"
    )
}

# 1) Orchestrator (chat/live via Gemma) -> :8000
Start-Svc "NEVA Orchestrator :8000" "$root\backend" `
    ".\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

# 2) Speech service (ASR + TTS) -> :8001
Start-Svc "NEVA Speech :8001" "$root\speech-service" `
    ".\venv\Scripts\Activate.ps1; uvicorn server:app --host 0.0.0.0 --port 8001"

# 3) Frontend (Vite) -> :5173
Start-Svc "NEVA Frontend :5173" "$root\frontend" `
    "npm run dev"

Write-Host ""
Write-Host "All three launching in separate windows:" -ForegroundColor Green
Write-Host "  Orchestrator  http://localhost:8000/health"
Write-Host "  Speech        http://localhost:8001/health"
Write-Host "  Frontend      http://localhost:5173"
Write-Host ""
Write-Host "Make sure Ollama is running (ollama list should show gemma4:12b)." -ForegroundColor Yellow
