# Deployment Guide (Vercel + Railway + Render)

This app has two parts:

| Part | Stack | Host |
|------|--------|------|
| **Frontend** | React + Vite | **Vercel** (or Render static) |
| **Backend** | Express + MySQL | **Railway** or **Render** |
| **Database** | MySQL | Railway MySQL, Render MySQL, PlanetScale, etc. |

---

## 1. Database (MySQL)

Create a MySQL database on **Railway** or **Render** (or use PlanetScale).

Run the schema once (optional if `SYNC_DB=true` on the API):

```bash
mysql -h HOST -u USER -p DATABASE < schema.sql
```

---

## 2. Backend — Railway

1. New Project → **Deploy from GitHub** → select this repo.
2. Add a **MySQL** service (or use an external DB).
3. Add a **Service** for the API:
   - **Root Directory:** `server`
   - **Start Command:** `npm start` (from `railway.toml`)
4. **Variables** (Settings → Variables):

   | Variable | Value |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` or your connection string |
   | `DB_SSL` | `true` (if using public MySQL URL) |
   | `CORS_ORIGINS` | `https://your-app.vercel.app` |
   | `SYNC_DB` | `true` |
   | `SEED_DASHBOARD` | `true` |

5. Copy the public URL, e.g. `https://dashboard-api-production.up.railway.app`.

**Uploads:** Railway disk is ephemeral. For persistent images, add a [Volume](https://docs.railway.app/guides/volumes) and set `UPLOADS_DIR=/data/uploads`.

---

## 3. Backend — Render

1. **New → Blueprint** → connect repo (uses `render.yaml`), **or**
2. **New → Web Service** → Root Directory: `server`, Build: `npm install`, Start: `npm start`.

**Environment variables:**

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Internal/external MySQL URL |
| `DB_SSL` | `true` |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |
| `SYNC_DB` | `true` |
| `SEED_DASHBOARD` | `true` |

Health check path: `/health`

Copy the service URL, e.g. `https://dashboard-api.onrender.com`.

For persistent uploads on Render, attach a disk and set `UPLOADS_DIR` to the mount path.

---

## 4. Frontend — Vercel

1. Import the GitHub repo on [vercel.com](https://vercel.com).
2. **Framework Preset:** Vite (or use root `vercel.json`).
3. Leave **Root Directory** empty (repo root; `vercel.json` builds `client/`).
4. **Environment variables:**

   | Name | Value |
   |------|--------|
   | `VITE_API_BASE_URL` | `https://your-api.up.railway.app` (no trailing slash) |

5. Deploy.

6. Add the Vercel URL to the backend `CORS_ORIGINS` (comma-separated if you have preview URLs too):

   ```
   https://your-app.vercel.app,https://your-app-*.vercel.app
   ```

   For preview deployments, include your Vercel preview pattern or list staging URLs explicitly.

---

## 5. Frontend — Render (optional)

Use the `dashboard-web` service in `render.yaml`, or create a **Static Site**:

- Root: `client`
- Build: `npm install --legacy-peer-deps && npm run build`
- Publish: `dist`
- Env: `VITE_API_BASE_URL=https://your-api.onrender.com`

---

## Environment reference

### Server (`server/.env`)

See `server/.env.example`.

- **`DATABASE_URL`** — `mysql://user:pass@host:3306/dbname` (Railway/Render)
- **`CORS_ORIGINS`** — allowed frontend origins (required in production)
- **`DB_SSL`** — `true` for most hosted MySQL
- **`UPLOADS_DIR`** — custom path for persistent disk

### Client (`client/.env`)

See `client/.env.example`.

- **`VITE_API_BASE_URL`** — backend URL (required on Vercel)

---

## Quick checklist

- [ ] MySQL running and reachable from API
- [ ] API deployed; `/health` returns `{ "status": "ok" }`
- [ ] `CORS_ORIGINS` includes your frontend URL
- [ ] `VITE_API_BASE_URL` set on Vercel to API URL
- [ ] Redeploy frontend after changing env vars
- [ ] Test: load app → add widget → Publish → refresh

---

## Local development

```bash
npm run install:all
# server/.env + client/.env from .env.example files
npm start
```

Frontend: `http://localhost:5173` · API: `http://localhost:5000`
