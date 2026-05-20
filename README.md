# Dynamic Dashboard Builder

Drag-and-drop dashboard editor (text, image, bar/line charts). Layouts save to **MySQL**.

---

## Deliverables (this repo)

| # | What | Where |
|---|------|--------|
| 1 | **Working prototype** (dummy chart data, drag/resize) | Run with `npm start` → http://localhost:5173 |
| 2 | **SQL schema + sample data** | [`schema.sql`](./schema.sql) |
| 3 | **Setup instructions** | This file |

---

## Setup (5 steps)

**Need:** Node.js 18+, MySQL

```bash
# 1. Install
npm run install:all

# 2. Database (creates tables + sample row)
mysql -u root -p < schema.sql

# 3. Config
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit **`server/.env`** — MySQL user/password (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME=dynamic_dashboard`).

Edit **`client/.env`** — local API:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
# 4. Run (client + server)
npm start
```

| URL | |
|-----|--|
| http://localhost:5173 | Builder UI |
| http://localhost:5000 | API |

---

## Use the prototype

1. **New dashboard** — blank canvas.  
2. Left: drag **Text**, **Image**, **Chart**; **Sections** to add/move/resize sections.  
3. Right panel: bold, italic, font size, chart type, **New data** (random dummy values).  
4. **Save** — stores layout in MySQL.  
5. **Load** — pick a dashboard from the list and restore it.

Charts use **Recharts** with generated dummy data (assignment allows Chart.js-style libraries).

---

## SQL (`schema.sql`)

**Tables**

- `dashboards` — saved projects (`project_data` = full JSON layout)
- `widgets`, `widget_positions`, `widget_styles` — per-widget rows (synced on Save)

**Sample data**

- Dashboard `d1` — `Sample Dashboard`
- Optional demo text widget `demo-w1` (see bottom of `schema.sql`)

---

## Project folders

```
client/     React UI
server/     Express API
schema.sql  MySQL DDL + inserts
```

**Tech:** React, Vite, Recharts, react-moveable, Express, Sequelize, MySQL
