const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WidgetPosition = sequelize.define(
  'WidgetPosition',
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    widgetId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
      field: 'widget_id',
    },
    x: { type: DataTypes.INTEGER, defaultValue: 0 },
    y: { type: DataTypes.INTEGER, defaultValue: 0 },
    w: { type: DataTypes.INTEGER, defaultValue: 4 },
    h: { type: DataTypes.INTEGER, defaultValue: 2 },
  },
  {
    tableName: 'widget_positions',
    underscored: true,
  },
);

module.exports = WidgetPosition;
