#!/bin/bash

# Brainwave - Stop All Servers Script

echo "🛑 Stopping Brainwave servers..."
echo ""

# Read PIDs from files
BACKEND_PID=$(cat /tmp/brainwave-backend.pid 2>/dev/null)
FRONTEND_PID=$(cat /tmp/brainwave-frontend.pid 2>/dev/null)

# Stop processes
if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null && echo "✅ Backend stopped (PID: $BACKEND_PID)" || echo "⚠️  Backend not running"
fi

if [ -n "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null && echo "✅ Frontend stopped (PID: $FRONTEND_PID)" || echo "⚠️  Frontend not running"
fi

# Cleanup PID files
rm -f /tmp/brainwave-backend.pid /tmp/brainwave-frontend.pid

# Kill any remaining uvicorn/vite processes (fallback)
pkill -f "uvicorn src.app.main:app" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo ""
echo "✅ All servers stopped"
