const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Widget = sequelize.define(
  'Widget',
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    dashboardId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      field: 'dashboard_id',
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'widgets',
    underscored: true,
  },
);

module.exports = Widget;
