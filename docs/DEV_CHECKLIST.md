# Development Checklist & Manual Tests

Basic env locations:

- `server/.env.example` (copy to `server/.env` for local dev)
- `client` reads `VITE_API_URL` from `import.meta.env` (`.env` files managed by Vite)

Required server env vars (example in `server/.env.example`):

- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/bondos
- JWT_SECRET=supersecret
- JWT_REFRESH_SECRET=refreshsecret
- CLIENT_URL=http://localhost:5173

Manual server checks:

- Start server: `cd server && npm start`
- Health check: `curl http://localhost:5000/health`
- Confirm only one process listens on port 5000: `lsof -i :5000`

Auth manual test (curl):

Register:
```
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","email":"test@example.com","password":"password"}'
```

Login:
```
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'
```

Frontend notes:

- `AuthContext` now uses the canonical `api` axios instance and stores tokens under `localStorage.tokens` as `{ accessToken, refreshToken }`.
- `SocketContext` reads `tokens` and passes `auth: { token }` to `io()`.
- `useAppContext` was removed; use `useAuth` and `useSocket` instead.

Logging:

- Backend writes to `logs/backend.log` and only prints to console in non-production.

CI & tests:

- GitHub Actions: `.github/workflows/ci.yml` runs server tests, client lint/tests, and repository `npm run check`.
