const { randomUUID } = require('crypto');
const { Dashboard, Widget } = require('../models');
const {
  syncWidgetsFromSnapshot,
  loadWidgetsForDashboard,
  buildSnapshotFromWidgets,
} = require('../utils/projectSync');

exports.listDashboards = async (req, res) => {
  try {
    const rows = await Dashboard.findAll({
      attributes: ['id', 'name', 'updatedAt', 'projectData'],
      order: [['updatedAt', 'DESC']],
    });

    const list = await Promise.all(
      rows.map(async (d) => {
        const widgetCount = await Widget.count({ where: { dashboardId: d.id } });
        const hasProjectData = !!(d.projectData?.project);
        return {
          id: d.id,
          name: d.name,
          updatedAt: d.updatedAt,
          widgetCount,
          hasLayout: hasProjectData || widgetCount > 0,
        };
      }),
    );

    res.json(list);
  } catch (error) {
    console.error('Error listing dashboards:', error);
    res.status(500).json({ error: 'Failed to list dashboards' });
  }
};

exports.createDashboard = async (req, res) => {
  try {
    const id = req.body.id || randomUUID();
    const name = req.body.name?.trim() || 'Untitled Dashboard';
    const [dashboard, created] = await Dashboard.findOrCreate({
      where: { id },
      defaults: { name },
    });
    if (!created && req.body.name) {
      await dashboard.update({ name });
    }
    res.status(created ? 201 : 200).json({ id: dashboard.id, name: dashboard.name, created });
  } catch (error) {
    console.error('Error creating dashboard:', error);
    res.status(500).json({ error: 'Failed to create dashboard' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await Dashboard.findByPk(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const stored = dashboard.projectData;
    if (stored?.project && (stored.elements?.length ?? 0) > 0) {
      return res.json(stored);
    }

    const widgets = await loadWidgetsForDashboard(id);
    if (!widgets.length) {
      return res.json({ project: null });
    }

    const snapshot = buildSnapshotFromWidgets(dashboard, widgets);
    return res.json(snapshot);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.saveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await Dashboard.findByPk(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const snapshot = req.body;
    await dashboard.update({ projectData: snapshot });
    await syncWidgetsFromSnapshot(id, snapshot);

    res.json({
      message: 'Project saved successfully',
      widgetsSynced: (snapshot.elements ?? []).length,
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
};

exports.deleteDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const n = await Dashboard.destroy({ where: { id } });
    if (!n) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ error: 'Failed to delete dashboard' });
  }
};
