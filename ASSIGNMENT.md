# Assignment — Dynamic Dashboard Builder

Uses the **full Canva-style editor UI** from `srishbish-wedding-invites/apps/builder` (drag-drop, layers, inspector, responsive breakpoints, Moveable resize) plus **MySQL** persistence for the assignment.

## Requirements

| Requirement | How |
|-------------|-----|
| Add / move / resize | Absolute layout + Moveable (same as wedding builder) |
| Rich text (bold, italic, size) | Text widget — double-click to edit |
| Image upload | Image widget + assets panel + `POST /api/upload` |
| Bar/line chart + dynamic data | **Chart** widget (Recharts) + ↻ regenerate |
| Draggable & resizable | Selection layer + drag handles |
| Save/load MySQL | **Save MySQL** in top bar → `PUT /api/dashboards/d1/project` |
| Responsive | Mobile / tablet / desktop device switcher |
| Express + MySQL APIs | `server/` |

## Run locally

```bash
npm run install:all
# server/.env — DATABASE_URL (Railway MySQL)
# client/.env — VITE_API_BASE_URL=http://localhost:5000

npm start
```

Open http://localhost:5173 → **New project** or **Load from MySQL** → edit → **Save MySQL**.

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md). Set `CORS_ORIGINS` and `VITE_API_BASE_URL`.
