const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('./models');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { UPLOADS_DIR, ensureUploadsDir } = require('./config/uploads');
const { getCorsOptions } = require('./config/cors');
const { ensureDefaultDashboard } = require('./utils/bootstrap');
const { runMigrations } = require('./utils/migrations');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

ensureUploadsDir();

app.use(cors(getCorsOptions()));
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await db.authenticate();
    console.log('Database connected');

    if (process.env.SYNC_DB !== 'false') {
      await db.sync();
      console.log('Database synced');
    }

    await runMigrations(db);

    if (process.env.SEED_DASHBOARD !== 'false') {
      await ensureDefaultDashboard();
      console.log('Default dashboard ready');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
