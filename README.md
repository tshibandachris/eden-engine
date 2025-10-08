
# Eden Engine — Final Project Package

This archive contains the final Eden Engine project ready to be uploaded to GitHub and deployed.

Contents:
- `server/` — Express backend (API endpoints, predictor, cache)
- `frontend/` — Next.js frontend (PWA ready)
- `.env.example` files for server and frontend
- `icons/` — placeholder icons for PWA

Quick start (local):
1. Backend:
   cd server
   cp .env.example .env
   npm install
   npm run dev

2. Frontend:
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev

Frontend: http://localhost:3000
Backend:  http://localhost:5000/api/matches?date=YYYY-MM-DD

Author: Christian Tshibanda (Chris)
