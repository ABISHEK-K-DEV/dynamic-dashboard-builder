const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dashboard = sequelize.define('Dashboard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'project_data',
  },
}, {
  tableName: 'dashboards',
  underscored: true,
});

module.exports = Dashboard;
