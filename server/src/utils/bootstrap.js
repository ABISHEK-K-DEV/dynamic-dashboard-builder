const { Dashboard } = require('../models');

async function ensureDefaultDashboard() {
  const id = process.env.DEFAULT_DASHBOARD_ID || 'd1';
  const name = process.env.DEFAULT_DASHBOARD_NAME || 'Sample Dashboard';

  await Dashboard.findOrCreate({
    where: { id },
    defaults: { name },
  });
}

module.exports = { ensureDefaultDashboard };
