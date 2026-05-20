const { Dashboard } = require('../models');

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await Dashboard.findByPk(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    if (!dashboard.projectData) {
      return res.json({ project: null });
    }
    res.json(dashboard.projectData);
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
    await dashboard.update({ projectData: req.body });
    res.json({ message: 'Project saved successfully' });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
};
