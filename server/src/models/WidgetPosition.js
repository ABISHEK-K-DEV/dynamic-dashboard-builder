const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WidgetPosition = sequelize.define('WidgetPosition', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  widgetId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'widget_id',
  },
  x: { type: DataTypes.INTEGER, defaultValue: 0 },
  y: { type: DataTypes.INTEGER, defaultValue: 0 },
  w: { type: DataTypes.INTEGER, defaultValue: 4 },
  h: { type: DataTypes.INTEGER, defaultValue: 4 },
}, {
  tableName: 'widget_positions',
  underscored: true,
});

module.exports = WidgetPosition;
