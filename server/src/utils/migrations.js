/** Add columns introduced after the original schema.sql (safe to run repeatedly). */
async function ensureProjectDataColumn(sequelize) {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'dashboards'
       AND COLUMN_NAME = 'project_data'`,
  );

  if (Number(rows[0]?.cnt) > 0) return;

  await sequelize.query('ALTER TABLE dashboards ADD COLUMN project_data JSON NULL');
  console.log('Migration: added dashboards.project_data column');
}

async function runMigrations(sequelize) {
  await ensureProjectDataColumn(sequelize);
}

module.exports = { runMigrations, ensureProjectDataColumn };
