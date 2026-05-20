# Dynamic Dashboard Builder

A drag-and-drop dashboard/page builder inspired by Figma, Canva, and Webflow editors.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Grid Layout, React Quill, Recharts
- **Backend:** Node.js, Express, MySQL, Sequelize

See **[ASSIGNMENT.md](./ASSIGNMENT.md)** for requirement mapping and demo steps.

## Features

- Drag, resize, and arrange widgets (text, image, charts)
- Rich text editing (bold, italic, font size)
- Image upload and chart widgets (bar / line / pie)
- Save and restore layouts from MySQL

## Local setup

1. **Install dependencies**

   ```bash
   npm run install:all
   ```

   Dependencies are installed only in `client/` and `server/` (no root `node_modules`).

2. **Database**

   ```bash
   mysql -u root -p < schema.sql
   ```

3. **Environment**

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   Edit `server/.env` with your MySQL credentials.

4. **Run**

   ```bash
   npm start
   ```

   - Frontend: http://localhost:5173  
   - API: http://localhost:5000  

## Deployment (Vercel + Railway / Render)

| Service | Platform |
|---------|----------|
| React app | **Vercel** |
| Express API + MySQL | **Railway** or **Render** |

Full step-by-step instructions: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Production env (minimum):**

- **Vercel:** `VITE_API_BASE_URL=https://your-api.example.com`
- **Railway/Render API:** `DATABASE_URL`, `CORS_ORIGINS=https://your-app.vercel.app`, `NODE_ENV=production`

## Project structure

```
client/          React frontend (deploy to Vercel)
server/          Express API (deploy to Railway or Render)
schema.sql       MySQL schema + seed data
render.yaml      Render blueprint
vercel.json      Vercel build config (monorepo root)
```
