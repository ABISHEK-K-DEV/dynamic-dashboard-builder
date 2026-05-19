const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Widget = sequelize.define('Widget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dashboardId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'dashboard_id',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'widgets',
  underscored: true,
});

module.exports = Widget;
