#!/bin/bash

# Brainwave - Full Stack Startup Script
# Starts both backend (FastAPI) and frontend (React+Vite) servers

set -e

echo "========================================="
echo "🚀 Brainwave - Starting Full Stack"
echo "========================================="
echo ""

# Get project root (assuming script is in Brainwave directory)
cd ~/Desktop
REPO_DIR=$(ls -d Brainwave* 2>/dev/null | head -1)

if [ -z "$REPO_DIR" ]; then
    echo "❌ ERROR: Cannot find Brainwave directory"
    exit 1
fi

cd "$REPO_DIR"
PROJECT_ROOT=$(pwd)
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# ============================================
# BACKEND SETUP & START
# ============================================

echo "🔧 Starting Backend (FastAPI)..."
echo ""

BACKEND_DIR="$PROJECT_ROOT/backend-ml"
VENV_PATH="$BACKEND_DIR/.venv"

# Check if venv exists
if [ ! -d "$VENV_PATH" ]; then
    echo "❌ Virtual environment not found at: $VENV_PATH"
    echo ""
    echo "Please create it first:"
    echo "  cd $BACKEND_DIR"
    echo "  python3 -m venv .venv"
    echo "  source .venv/bin/activate"
    echo "  pip install -r sim/requirements.txt"
    exit 1
fi

# Start backend in background
cd "$BACKEND_DIR/sim"
source "$VENV_PATH/bin/activate"

echo "✓ Virtual environment activated"
echo "✓ Starting uvicorn server..."
echo ""

# Start uvicorn in background
uvicorn src.app.main:app --reload --host 127.0.0.1 --port 8000 > /tmp/brainwave-backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   URL: http://127.0.0.1:8000"
echo "   Logs: /tmp/brainwave-backend.log"
echo ""

# Wait for backend to start
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ Backend failed to start. Check logs:"
    tail -20 /tmp/brainwave-backend.log
    exit 1
fi

# ============================================
# FRONTEND SETUP & START
# ============================================

echo "🎨 Starting Frontend (React + Vite)..."
echo ""

FRONTEND_DIR="$PROJECT_ROOT/Frontend"

# Check if node_modules exists
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    cd "$FRONTEND_DIR"
    npm install
    echo ""
fi

cd "$FRONTEND_DIR"

echo "✓ Starting Vite dev server..."
echo ""

# Start frontend in background
npm run dev > /tmp/brainwave-frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   URL: http://localhost:5173"
echo "   Logs: /tmp/brainwave-frontend.log"
echo ""

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo "❌ Frontend failed to start. Check logs:"
    tail -20 /tmp/brainwave-frontend.log
    # Kill backend before exiting
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# ============================================
# SUCCESS MESSAGE
# ============================================

echo "========================================="
echo "✅ Brainwave is now running!"
echo "========================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://127.0.0.1:8000"
echo "📖 API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "📊 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/brainwave-backend.log"
echo "   Frontend: tail -f /tmp/brainwave-frontend.log"
echo ""
echo "⛔ To stop both servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   OR press Ctrl+C and run: pkill -f 'uvicorn|vite'"
echo ""
echo "========================================="
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > /tmp/brainwave-backend.pid
echo "$FRONTEND_PID" > /tmp/brainwave-frontend.pid

# Keep script running and wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ Servers stopped'; exit 0" INT TERM

echo "Press Ctrl+C to stop all servers..."
echo ""

# Wait for both processes
wait
