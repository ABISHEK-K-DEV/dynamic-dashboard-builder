const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WidgetStyle = sequelize.define(
  'WidgetStyle',
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
    fontSize: { type: DataTypes.STRING(20), field: 'font_size' },
    color: { type: DataTypes.STRING(50) },
    background: { type: DataTypes.STRING(50) },
    borderRadius: { type: DataTypes.STRING(20), field: 'border_radius' },
    opacity: { type: DataTypes.DECIMAL(3, 2), defaultValue: 1 },
    align: { type: DataTypes.STRING(20) },
  },
  {
    tableName: 'widget_styles',
    underscored: true,
  },
);

module.exports = WidgetStyle;
