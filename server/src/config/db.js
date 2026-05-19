const { Sequelize } = require('sequelize');
require('dotenv').config();

function getSslDialectOptions() {
  if (process.env.DB_SSL !== 'true') return {};
  // Railway / PlanetScale public URLs use certs that fail strict verification
  const strictSsl = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
  return {
    ssl: {
      require: true,
      rejectUnauthorized: strictSsl,
    },
  };
}

function configFromDatabaseUrl(urlString) {
  const url = new URL(urlString);
  return {
    database: url.pathname.replace(/^\//, ''),
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    dialect: 'mysql',
    dialectOptions: getSslDialectOptions(),
    logging: false,
  };
}

function getSequelizeOptions() {
  const connectionUrl =
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    process.env.MYSQLDATABASE_URL;

  if (connectionUrl) {
    return configFromDatabaseUrl(connectionUrl);
  }

  return {
    database: process.env.DB_NAME || 'dynamic_dashboard',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    dialectOptions: getSslDialectOptions(),
    logging: false,
  };
}

const sequelize = new Sequelize(getSequelizeOptions());

module.exports = sequelize;
