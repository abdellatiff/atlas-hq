#!/bin/bash

# Atlas HQ Startup Script
# This script starts Atlas HQ dashboard

ATLAS_HQ_DIR="/data/.openclaw/workspace/atlas-hq/atlas-hq"
LOG_FILE="/tmp/atlas-hq.log"
PID_FILE="/tmp/atlas-hq.pid"

# Function to check if Atlas HQ is already running
is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# Start Atlas HQ
start() {
    if is_running; then
        echo "Atlas HQ is already running (PID: $(cat $PID_FILE))"
        return 0
    fi

    echo "Starting Atlas HQ..."
    cd "$ATLAS_HQ_DIR" || exit 1
    
    # Export environment variables
    export HOSTNAME=0.0.0.0
    export PORT=8080
    
    # Start in background
    nohup npm start > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    # Wait a moment and check if it started
    sleep 3
    if is_running; then
        echo "Atlas HQ started successfully on http://0.0.0.0:8080"
        echo "PID: $(cat $PID_FILE)"
        return 0
    else
        echo "Failed to start Atlas HQ. Check $LOG_FILE"
        return 1
    fi
}

# Stop Atlas HQ
stop() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "Stopping Atlas HQ (PID: $PID)..."
            kill "$PID"
            rm -f "$PID_FILE"
            echo "Atlas HQ stopped"
        else
            echo "Atlas HQ is not running"
            rm -f "$PID_FILE"
        fi
    else
        echo "Atlas HQ is not running"
    fi
}

# Restart Atlas HQ
restart() {
    stop
    sleep 2
    start
}

# Status check
status() {
    if is_running; then
        echo "Atlas HQ is running (PID: $(cat $PID_FILE))"
        echo "URL: http://0.0.0.0:8080"
        return 0
    else
        echo "Atlas HQ is not running"
        return 1
    fi
}

# Main
 case "${1:-start}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
