#!/bin/bash
set -e

echo "🔨 Building frontend..."
cd client && npm run build && cd ..

echo "✅ Build complete!"
