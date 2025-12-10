#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

G="\e[32m"; Y="\e[33m"; R="\e[31m"; N="\e[0m"
info(){ echo -e "${G}[INFO]${N} $*"; }
err(){ echo -e "${R}[ERR]${N} $*" >&2; }

COMMAND="${1:-help}"

case "$COMMAND" in
  up)
    info "Starting Bondos Ultra Social..."
    docker compose up -d
    sleep 3
    docker compose ps
    info "✅ Stack is running!"
    info "Frontend: http://localhost:3000"
    info "Backend API: http://localhost:8000"
    info "API Docs: http://localhost:8000/docs"
    ;;
  down)
    info "Stopping stack..."
    docker compose down
    info "✅ Stack stopped."
    ;;
  restart)
    info "Restarting stack..."
    docker compose restart
    info "✅ Stack restarted."
    ;;
  logs)
    info "Showing logs..."
    docker compose logs -f --tail 100 "${2:-}"
    ;;
  build)
    info "Building containers..."
    docker compose build --no-cache
    info "✅ Build complete."
    ;;
  ps)
    docker compose ps
    ;;
  shell-backend)
    docker compose exec backend bash
    ;;
  shell-frontend)
    docker compose exec frontend sh
    ;;
  shell-db)
    docker compose exec db psql -U appuser -d appdb
    ;;
  clean)
    info "Cleaning up..."
    docker compose down -v
    info "✅ All containers and volumes removed."
    ;;
  *)
    echo "Bondos Ultra Social - Management Script"
    echo "Usage: $0 {command}"
    echo ""
    echo "Commands:"
    echo "  up            - Start the stack"
    echo "  down          - Stop the stack"
    echo "  restart       - Restart the stack"
    echo "  build         - Build containers"
    echo "  logs [service]- Show logs"
    echo "  ps            - Show running containers"
    echo "  shell-backend - Open backend shell"
    echo "  shell-frontend- Open frontend shell"
    echo "  shell-db      - Open database shell"
    echo "  clean         - Remove all containers & volumes"
    echo ""
    exit 1
    ;;
esac
