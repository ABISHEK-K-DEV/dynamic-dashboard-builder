const Dashboard = require('./Dashboard');
const Widget = require('./Widget');
const WidgetPosition = require('./WidgetPosition');
const WidgetStyle = require('./WidgetStyle');

Dashboard.hasMany(Widget, { foreignKey: 'dashboardId', as: 'widgets', onDelete: 'CASCADE' });
Widget.belongsTo(Dashboard, { foreignKey: 'dashboardId' });

Widget.hasOne(WidgetPosition, { foreignKey: 'widgetId', as: 'position', onDelete: 'CASCADE' });
WidgetPosition.belongsTo(Widget, { foreignKey: 'widgetId' });

Widget.hasOne(WidgetStyle, { foreignKey: 'widgetId', as: 'style', onDelete: 'CASCADE' });
WidgetStyle.belongsTo(Widget, { foreignKey: 'widgetId' });

module.exports = {
  Dashboard,
  Widget,
  WidgetPosition,
  WidgetStyle,
};
