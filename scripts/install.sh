#!/bin/bash
set -e

echo "🚀 Installing dependencies..."
cd server && npm install && cd ..
cd client && npm install && cd ..

echo "✅ Installation complete!"
