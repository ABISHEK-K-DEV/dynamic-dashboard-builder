const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WidgetStyle = sequelize.define('WidgetStyle', {
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
  fontSize: { type: DataTypes.STRING, field: 'font_size' },
  color: { type: DataTypes.STRING },
  background: { type: DataTypes.STRING },
  borderRadius: { type: DataTypes.STRING, field: 'border_radius' },
  opacity: { type: DataTypes.DECIMAL(3,2) },
  align: { type: DataTypes.STRING },
}, {
  tableName: 'widget_styles',
  underscored: true,
});

module.exports = WidgetStyle;
