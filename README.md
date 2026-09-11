# AI Expense Tracker

A full-stack AI-powered personal expense tracker built with React, Node.js, Express, PostgreSQL/Supabase, JWT authentication, Recharts, and Groq Vision.

## Features

- Register / login with JWT authentication
- Protected dashboard, history, scan and profile pages
- Add, edit and delete expenses
- Search, category/date filters and sorting
- Pagination on history
- AI receipt scanning using Groq `qwen/qwen3.6-27b`
- Dashboard:
  - Total spending
  - Current-month spending
  - Average receipt
  - Transaction count
  - Category breakdown
  - Monthly spending trend
  - Recent expenses
- AI spending insights
- Responsive dark UI
- PostgreSQL/Supabase database
- Ready for Vercel + Render deployment

## Requirements

- Node.js 22+
- PostgreSQL database (Supabase is recommended)
- Groq API key

## 1. Database

Create a Supabase project and run `backend/schema.sql` in the SQL Editor.

## 2. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill:

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=replace_with_a_long_random_secret
GROQ_API_KEY=gsk_...
CLIENT_URL=http://localhost:5173
```

Start:

```bash
npm run dev
```

## 3. Frontend

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Open http://localhost:5173

## Security

The Groq API key is intentionally kept on the backend. Do not put `GROQ_API_KEY` in the frontend `.env` and never commit `.env`.

## Deployment

### Backend - Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add all backend environment variables.

### Frontend - Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add:
  - `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`

Then update backend `CLIENT_URL` to your Vercel URL.

