#!/bin/bash

echo "🎮 Starting Bondos Ultra Social in development mode..."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop"

(cd server && npm run dev) &
(cd client && npm run dev) &

wait
