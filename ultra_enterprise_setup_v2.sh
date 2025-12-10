#!/usr/bin/env bash
# ultra_enterprise_setup_v2.sh
# One-shot Enterprise Bootstrap for Ubuntu 24.04
# Installs Docker/Compose, Caddy or cloudflared, UFW, fail2ban, Netdata, project scaffold,
# watchtower (auto-update), backups, cron jobs, health checks.
# Run with: sudo ./ultra_enterprise_setup_v2.sh

set -euo pipefail
IFS=$'\n\t'

LOGFILE="/tmp/ultra_enterprise_setup_v2.log"
exec > >(tee -a "$LOGFILE") 2>&1

# Colors
G="\e[32m"; Y="\e[33m"; R="\e[31m"; B="\e[34m"; N="\e[0m"
info(){ echo -e "${B}[INFO]${N} $*"; }
ok(){ echo -e "${G}[ OK ]${N} $*"; }
warn(){ echo -e "${Y}[WARN]${N} $*"; }
err(){ echo -e "${R}[ERR ]${N} $*" >&2; }

# Require root
if [ "$EUID" -ne 0 ]; then
  err "Please run as root: sudo $0"
  exit 2
fi

info "Ultra Enterprise Setup V2 starting..."
info "Log file: $LOGFILE"

# Small helper to ask yes/no
ask_yes_no(){
  # ask_yes_no "Prompt" default
  local prompt="${1:-Proceed?}"
  local default="${2:-Y}"
  local ans
  read -rp "$prompt [Y/n]: " ans
  ans=${ans:-$default}
  if [[ "$ans" =~ ^[Yy] ]]; then return 0; else return 1; fi
}

# 0) Basic checks
info "Checking environment..."
OS="$(lsb_release -is 2>/dev/null || echo Unknown)"
VER="$(lsb_release -rs 2>/dev/null || uname -r)"
KERNEL="$(uname -r)"
CPUCOUNT=$(nproc --all || echo 1)
MEM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo || echo 0)
MEM_MB=$((MEM_KB/1024))
FREE_MB=$(df --output=avail / | tail -1)
FREE_MB=$((FREE_MB/1024))

echo "OS: $OS $VER, Kernel: $KERNEL, CPUs: $CPUCOUNT, RAM: ${MEM_MB}MB, Free disk: ${FREE_MB}MB"

if [ "$MEM_MB" -lt 2000 ]; then
  warn "RAM is less than 2GB. Project may still run but limited. You have ${MEM_MB}MB."
fi
if [ "$FREE_MB" -lt 5000 ]; then
  warn "Free disk less than 5GB. Consider increasing storage. ($FREE_MB MB free)"
fi

# 1) Offer to fix cgroups/GRUB if docker had problems earlier
fix_cgroups_prompt(){
  if [ -f /sys/fs/cgroup/cgroup.controllers ] && [ -d /sys/fs/cgroup/unified ] ; then
    # probably cgroup v2 enabled; Docker may still work but we give user option
    info "Detected cgroup v2 environment. Some Docker setups prefer cgroup v1 for compatibility."
    if ask_yes_no "Apply GRUB cgroup compatibility options (systemd.unified_cgroup_hierarchy=0 ...) and update-grub? (requires reboot)" "n"; then
      sed -n '1,200p' /etc/default/grub >/dev/null 2>&1 || true
      if grep -q "cgroup_enable=memory" /etc/default/grub 2>/dev/null; then
        ok "GRUB already has cgroup options."
      else
        info "Adding cgroup options to GRUB_CMDLINE_LINUX..."
        sed -i.bak -E 's/^GRUB_CMDLINE_LINUX="(.*)"/GRUB_CMDLINE_LINUX="\1 systemd.unified_cgroup_hierarchy=0 cgroup_enable=memory swapaccount=1"/' /etc/default/grub || \
        echo 'GRUB_CMDLINE_LINUX="systemd.unified_cgroup_hierarchy=0 cgroup_enable=memory swapaccount=1"' >> /etc/default/grub
        info "Updating grub..."
        update-grub || true
        warn "GRUB updated (backup saved as /etc/default/grub.bak). Reboot required for change to take effect."
        if ask_yes_no "Reboot now to apply GRUB changes? (recommended)" "n"; then
          info "Rebooting now..."
          reboot
        else
          warn "You chose not to reboot now. Some Docker issues may persist until reboot."
        fi
      fi
    else
      info "Skipping GRUB cgroup changes."
    fi
  else
    ok "No special cgroup fix required."
  fi
}

# 2) Install prerequisites
install_prereqs(){
  info "Installing apt prerequisites..."
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg lsb-release git unzip jq apt-transport-https software-properties-common
  ok "Prerequisites installed."
}

# 3) Install Docker & Compose (official)
install_docker(){
  info "Installing Docker and Docker Compose plugin..."
  # cleanup old
  apt-get remove -y docker docker.io docker-engine containerd runc docker-compose || true
  rm -f /usr/local/bin/docker-compose /usr/bin/docker-compose || true

  mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin || {
    err "Docker install failed via apt. Attempt fallback script..."
    curl -fsSL https://get.docker.com | sh || { err "get.docker.com failed"; return 1; }
  }
  systemctl enable docker || true
  systemctl daemon-reload || true
  # start docker service and test
  systemctl restart docker || true
  sleep 2
  if systemctl is-active --quiet docker; then
    ok "Docker service running: $(docker --version || true)"
  else
    warn "Docker service not active. Showing last 30 docker journal lines:"
    journalctl -u docker --no-pager -n 30 || true
    warn "You may need to reboot or fix cgroup settings. The script can attempt fixes if you choose."
  fi
}

# 4) Firewall + fail2ban
setup_security(){
  info "Configuring UFW firewall and fail2ban..."
  apt-get install -y ufw fail2ban
  ufw default deny incoming || true
  ufw default allow outgoing || true
  ufw allow OpenSSH/tcp || true
  ufw allow 80/tcp || true
  ufw allow 443/tcp || true
  ufw --force enable || true
  systemctl enable --now fail2ban || true
  ok "Firewall (UFW) and fail2ban configured."
}

# 5) Caddy install (preferred) or cloudflared
install_caddy(){
  info "Installing Caddy..."
  # Official Cloudsmith repo install (works on Ubuntu)
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' 2>/dev/null | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg || true
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/setup.deb.sh' 2>/dev/null | bash || true
  apt-get update -y
  apt-get install -y caddy || {
    warn "Apt caddy failed. Trying to download static caddy binary..."
    CADDY_BIN="/usr/local/bin/caddy"
    curl -Lo "$CADDY_BIN" "https://github.com/caddyserver/caddy/releases/latest/download/caddy_$(dpkg --print-architecture)_" 2>/dev/null || true
    chmod +x "$CADDY_BIN" || true
  }
  if command -v caddy >/dev/null 2>&1; then
    ok "Caddy installed: $(caddy version 2>/dev/null || echo 'unknown')"
    systemctl enable --now caddy || warn "Could not enable caddy service"
  else
    warn "Caddy not installed. You can choose cloudflared tunnel later."
  fi
}

install_cloudflared(){
  info "Installing cloudflared (for Cloudflare Tunnel)..."
  ARCH=$(dpkg --print-architecture)
  if [[ "$ARCH" == "amd64" || "$ARCH" == "x86_64" ]]; then
    curl -L -o /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  else
    curl -L -o /usr/local/bin/cloudflared "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-$(uname -m)"
  fi
  chmod +x /usr/local/bin/cloudflared
  if command -v cloudflared >/dev/null 2>&1; then ok "cloudflared installed"; else warn "cloudflared install might have failed"; fi
}

# 6) Project scaffold (safe: only create missing files)
PROJECT_DIR="/opt/bondos_ultra_social"
scaffold_project(){
  info "Preparing project scaffold in $PROJECT_DIR (will NOT overwrite existing files)..."
  mkdir -p "$PROJECT_DIR"
  # backend
  mkdir -p "$PROJECT_DIR/server/app"
  if [ ! -f "$PROJECT_DIR/server/requirements.txt" ]; then
    cat > "$PROJECT_DIR/server/requirements.txt" <<'PY'
fastapi
uvicorn[standard]
python-dotenv
pydantic
PY
  fi
  if [ ! -f "$PROJECT_DIR/server/app/main.py" ]; then
    cat > "$PROJECT_DIR/server/app/main.py" <<'PYMAIN'
from fastapi import FastAPI
app = FastAPI()
@app.get("/health")
async def health():
    return {"status":"ok"}
@app.get("/")
async def root():
    return {"message":"Bondos Ultra Social - Backend"}
PYMAIN
  fi
  if [ ! -f "$PROJECT_DIR/server/Dockerfile" ]; then
    cat > "$PROJECT_DIR/server/Dockerfile" <<'DF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY . /app
EXPOSE 8000
CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]
DF
  fi

  # frontend
  mkdir -p "$PROJECT_DIR/client/src"
  if [ ! -f "$PROJECT_DIR/client/package.json" ]; then
    cat > "$PROJECT_DIR/client/package.json" <<'PJ'
{
  "name":"bondos-client",
  "version":"0.1.0",
  "private":true,
  "scripts":{"dev":"vite","build":"vite build","preview":"vite preview --port 3000"},
  "dependencies":{"react":"^18.2.0","react-dom":"^18.2.0"},
  "devDependencies":{"vite":"^5.0.0"}
}
PJ
  fi
  if [ ! -f "$PROJECT_DIR/client/index.html" ]; then
    cat > "$PROJECT_DIR/client/index.html" <<'HTML'
<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Bondos</title></head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>
HTML
  fi
  if [ ! -f "$PROJECT_DIR/client/src/main.jsx" ]; then
    cat > "$PROJECT_DIR/client/src/main.jsx" <<'JS'
import React from "react";
import { createRoot } from "react-dom/client";
function App(){ return <div style={{padding:20,fontFamily:"Arial"}}><h1>Bondos Ultra Social</h1><p>Welcome!</p></div> }
createRoot(document.getElementById("root")).render(<App/>);
JS
  fi
  if [ ! -f "$PROJECT_DIR/client/Dockerfile" ]; then
    cat > "$PROJECT_DIR/client/Dockerfile" <<'DFC'
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --silent
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","3000"]
DFC
  fi

  # docker-compose.yml (safe create if not exists)
  if [ ! -f "$PROJECT_DIR/docker-compose.yml" ]; then
    cat > "$PROJECT_DIR/docker-compose.yml" <<'YAML'
version: "3.9"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppassword
      POSTGRES_DB: appdb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7
    restart: unless-stopped

  backend:
    build: ./server
    volumes:
      - ./server:/app
    environment:
      - DATABASE_URL=postgresql://appuser:apppassword@db:5432/appdb
    depends_on: [db, redis]
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL","curl -f http://localhost:8000/health || exit 1"]
      interval: 30s; timeout: 10s; retries: 5

  frontend:
    build: ./client
    volumes:
      - ./client:/usr/src/app
    depends_on: [backend]
    ports:
      - "3000:3000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD","sh","-c","curl -f http://localhost:3000/ || exit 1"]
      interval: 30s; timeout: 10s; retries: 3

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --cleanup --interval 300
    restart: unless-stopped

volumes:
  db_data:
YAML
  fi

  # infra
  mkdir -p "$PROJECT_DIR/infra/caddy"
  if [ ! -f "$PROJECT_DIR/infra/caddy/Caddyfile" ]; then
    cat > "$PROJECT_DIR/infra/caddy/Caddyfile" <<'CADDY'
:80
respond "Caddy placeholder - configure domain later"
CADDY
  fi

  ok "Project scaffold created (or reused existing)."
fi

# 7) Domain options (DuckDNS, Cloudflare Tunnel, Manual domain, None)
configure_domain(){
  info "Domain options: 1) DuckDNS (free)  2) Cloudflare Tunnel (no public IP)  3) I will set domain manually  4) Skip domain"
  read -rp "Choose 1/2/3/4 (default 1): " CHOICE
  CHOICE=${CHOICE:-1}
  case "$CHOICE" in
    1)
      read -rp "Enter DuckDNS subdomain name (eg myproj -> myproj.duckdns.org): " DUCKNAME
      DUCKNAME=${DUCKNAME:-mybondos}
      DUCK_DOMAIN="${DUCKNAME}.duckdns.org"
      read -rp "Enter DuckDNS token (if you have, else leave blank to set later): " DUCK_TOKEN
      mkdir -p "$PROJECT_DIR/infra/duckdns"
      cat > "$PROJECT_DIR/infra/duckdns/duckdns.env" <<EOF
DUCK_DOMAIN=${DUCK_DOMAIN}
DUCK_TOKEN=${DUCK_TOKEN}
EOF
      cat > "$PROJECT_DIR/infra/duckdns/update_duckdns.sh" <<'SH'
#!/usr/bin/env bash
# usage: ./update_duckdns.sh <domain> <token>
DOM=${1:-}
TOK=${2:-}
if [ -z "$DOM" ] || [ -z "$TOK" ]; then
  echo "Usage: $0 domain token"
  exit 1
fi
curl -s "https://www.duckdns.org/update?domains=$DOM&token=$TOK&ip=" >/dev/null
echo "DuckDNS update requested for $DOM"
SH
      chmod +x "$PROJECT_DIR/infra/duckdns/update_duckdns.sh"
      ok "DuckDNS configured at $PROJECT_DIR/infra/duckdns"
      DOMAIN_CHOICE=duckdns
      ;;
    2)
      install_cloudflared
      warn "Follow cloudflared instructions: run 'cloudflared tunnel login' and create/run a tunnel manually."
      DOMAIN_CHOICE=cloudflared
      ;;
    3)
      read -rp "Enter your domain (eg example.com) and point DNS A -> this server IP: " USER_DOMAIN
      DOMAIN_CHOICE=manual
      ;;
    4)
      warn "Skipping domain. You can access services via IP:PORT."
      DOMAIN_CHOICE=none
      ;;
    *)
      warn "Invalid choice; defaulting to DuckDNS"
      DOMAIN_CHOICE=duckdns
      ;;
  esac
}

# 8) Configure Caddyfile (if caddy installed)
configure_caddyfile(){
  if command -v caddy >/dev/null 2>&1; then
    PUBLIC_HOST="localhost"
    if [ "${DOMAIN_CHOICE:-}" = "duckdns" ]; then PUBLIC_HOST="${DUCK_DOMAIN}"; fi
    if [ "${DOMAIN_CHOICE:-}" = "manual" ]; then PUBLIC_HOST="${USER_DOMAIN}"; fi
    info "Writing Caddyfile for $PUBLIC_HOST"
    cat > "$PROJECT_DIR/infra/caddy/Caddyfile" <<CADDY
${PUBLIC_HOST} {
  encode gzip
  reverse_proxy /api/*  http://backend:8000
  reverse_proxy /health  http://backend:8000
  reverse_proxy /*       http://frontend:3000
  log {
    output file /var/log/caddy/access.log {
      roll_size 50mb
      roll_keep 5
      roll_keep_for 720h
    }
  }
}
CADDY
    # If system caddy present, copy to system location
    if [ -f /etc/caddy/Caddyfile ] || systemctl list-unit-files | grep -q caddy; then
      cp "$PROJECT_DIR/infra/caddy/Caddyfile" /etc/caddy/Caddyfile || true
      systemctl reload caddy || systemctl restart caddy || warn "Could not restart caddy automatically"
    fi
    ok "Caddyfile configured."
  else
    warn "Caddy not installed; skipping Caddyfile configuration."
  fi
}

# 9) Build & run docker-compose
docker_compose_up(){
  info "Bringing up docker compose stack..."
  cd "$PROJECT_DIR"
  # attempt to use plugin 'docker compose' else 'docker-compose'
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
  elif docker-compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
  else
    err "No docker compose command available"
    return 1
  fi

  # Build & up
  $COMPOSE_CMD build --pull --no-cache || warn "Build had issues; continuing."
  $COMPOSE_CMD up -d || { err "docker compose up failed"; $COMPOSE_CMD ps || true; journalctl -u docker --no-pager -n 50 || true; return 1; }
  ok "Containers started (docker compose up -d)."
  sleep 4
  $COMPOSE_CMD ps || true
}

# 10) Install Netdata (monitoring)
install_netdata(){
  info "Installing Netdata (lightweight monitoring)..."
  bash <(curl -Ss https://my-netdata.io/kickstart.sh) --dont-wait || warn "Netdata install attempted; check /var/log/netdata if interactive required."
  ok "Netdata installation attempted. UI on port 19999 if running."
}

# 11) Backups + cron
setup_backups(){
  BACKUP_DIR="/var/backups/bondos"
  mkdir -p "$BACKUP_DIR"
  cat > /etc/cron.daily/bondos_backup <<'CRON'
#!/bin/bash
BACKUP_DIR="/var/backups/bondos"
TIMESTAMP=$(date +%Y%m%d_%H%M)
mkdir -p "$BACKUP_DIR"
# postgres dump inside container (if exists)
DB_CONTAINER=$(docker ps --format '{{.Names}}' | grep db || true)
if [ -n "$DB_CONTAINER" ]; then
  docker exec -t "$DB_CONTAINER" pg_dumpall -U appuser > "$BACKUP_DIR/pg_all_${TIMESTAMP}.sql" 2>/dev/null || true
fi
tar -czf "$BACKUP_DIR/app_${TIMESTAMP}.tgz" /opt/bondos_ultra_social 2>/dev/null || true
find "$BACKUP_DIR" -type f -mtime +7 -delete
CRON
  chmod +x /etc/cron.daily/bondos_backup
  ok "Daily backup script installed (/etc/cron.daily/bondos_backup). Backups to $BACKUP_DIR"
}

# 12) Health checks summary
health_checks(){
  info "Running health checks (backend -> 8000, frontend -> 3000)..."
  sleep 3
  BACK_OK=false; FRONT_OK=false
  if curl -sSf http://127.0.0.1:8000/health >/dev/null 2>&1; then BACK_OK=true; fi
  if curl -sSf http://127.0.0.1:3000/ >/dev/null 2>&1; then FRONT_OK=true; fi

  echo "==== Health summary ===="
  echo "Backend (8000): $([ "$BACK_OK" = true ] && echo OK || echo FAIL)"
  echo "Frontend (3000): $([ "$FRONT_OK" = true ] && echo OK || echo FAIL)"
}

# 13) final instructions
final_report(){
  echo
  echo "====================================="
  echo "Setup log: $LOGFILE"
  echo "Project dir: $PROJECT_DIR"
  if [ "${DOMAIN_CHOICE:-}" = "duckdns" ]; then
    echo "DuckDNS: ${DUCK_DOMAIN}  (put token in $PROJECT_DIR/infra/duckdns/duckdns.env and run update script)"
  elif [ "${DOMAIN_CHOICE:-}" = "cloudflared" ]; then
    echo "Cloudflared installed: run 'cloudflared tunnel login' interactively to create a tunnel and route to local service"
  elif [ "${DOMAIN_CHOICE:-}" = "manual" ]; then
    echo "Configured for your domain: $USER_DOMAIN (ensure DNS points to server)"
  else
    echo "No domain configured; access via server IP + ports"
  fi
  echo "Containers:"
  if docker compose ps >/dev/null 2>&1; then docker compose ps || true; else docker-compose ps || true; fi
  echo "Netdata: http://<server-ip>:19999 (if installed)"
  echo "Backups: /var/backups/bondos (daily cron)"
  echo "To view logs: cd $PROJECT_DIR && docker compose logs --tail 200"
  echo "To rebuild: cd $PROJECT_DIR && docker compose up -d --build"
  echo "====================================="
  ok "Ultra Enterprise Setup complete (or attempted). Review the output above and the log at $LOGFILE"
}

# --- Run sequence with conditional checks ---
install_prereqs
fix_cgroups_prompt || true
install_docker || true
setup_security
install_caddy
scaffold_project
configure_domain
configure_caddyfile
docker_compose_up || warn "docker compose up had issues. Inspect logs."
install_netdata || warn "Netdata install had issues."
setup_backups
health_checks
final_report

# End
