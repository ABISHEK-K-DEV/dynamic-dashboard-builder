const mysql = require('mysql2/promise');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'dynamic_dashboard'
    });
    await connection.query("INSERT IGNORE INTO dashboards (id, name) VALUES ('d1', 'Sample Dashboard')");
    await connection.query("INSERT IGNORE INTO widgets (id, dashboard_id, type, content) VALUES ('w1', 'd1', 'text', 'Welcome to the Dashboard')");
    await connection.query("INSERT IGNORE INTO widget_positions (id, widget_id, x, y, w, h) VALUES ('p1', 'w1', 0, 0, 4, 2)");
    await connection.query("INSERT IGNORE INTO widget_styles (id, widget_id, font_size, color) VALUES ('s1', 'w1', '24px', '#ffffff')");
    console.log('Seeded initial dashboard and widgets');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
