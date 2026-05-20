const { Dashboard, Widget, WidgetPosition, WidgetStyle } = require('../models');

// Get a dashboard by ID, including its widgets and their positions and styles
exports.getDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboard = await Dashboard.findByPk(id, {
      include: [
        {
          model: Widget,
          as: 'widgets',
          include: [
            { model: WidgetPosition, as: 'position' },
            { model: WidgetStyle, as: 'style' }
          ]
        }
      ]
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// Create a new dashboard
exports.createDashboard = async (req, res) => {
  try {
    const { name } = req.body;
    const newDashboard = await Dashboard.create({ name });
    res.status(201).json(newDashboard);
  } catch (error) {
    console.error('Error creating dashboard:', error);
    res.status(500).json({ error: 'Failed to create dashboard' });
  }
};

// Save Layout (Creates/Updates/Deletes widgets based on payload)
exports.saveLayout = async (req, res) => {
  try {
    const { id } = req.params; // dashboard id
    const { widgets } = req.body; // array of widgets
    
    // Validate dashboard exists
    const dashboard = await Dashboard.findByPk(id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // A simpler approach is to delete all existing widgets and recreate them
    // For a more production-ready approach, we could upsert.
    // Let's use destroy & create for simplicity and exact sync.
    
    await Widget.destroy({ where: { dashboardId: id } });

    if (widgets && widgets.length > 0) {
      for (const w of widgets) {
        const newWidget = await Widget.create({
          id: w.id,
          dashboardId: id,
          type: w.type,
          content: w.content
        });

        if (w.position || w.layouts) {
          const desktop = w.layouts?.desktop || w.position || {};
          await WidgetPosition.create({
            widgetId: newWidget.id,
            x: desktop.x ?? 0,
            y: desktop.y ?? 0,
            w: desktop.w ?? 4,
            h: desktop.h ?? 4,
            layouts: w.layouts || null,
          });
        }

        if (w.style) {
          await WidgetStyle.create({
            widgetId: newWidget.id,
            fontSize: w.style.fontSize,
            color: w.style.color,
            background: w.style.background,
            borderRadius: w.style.borderRadius,
            opacity: w.style.opacity,
            align: w.style.align
          });
        }
      }
    }

    res.json({ message: 'Dashboard layout saved successfully' });
  } catch (error) {
    console.error('Error saving layout:', error);
    res.status(500).json({ error: 'Failed to save layout' });
  }
};

// Update single widget (optional - if we need real-time incremental saves)
exports.updateWidget = async (req, res) => {
  try {
    const { id } = req.params; // widget id
    const { content, position, style } = req.body;

    const widget = await Widget.findByPk(id);
    if (!widget) return res.status(404).json({ error: 'Widget not found' });

    if (content !== undefined) {
      await widget.update({ content });
    }

    if (position) {
      const pos = await WidgetPosition.findOne({ where: { widgetId: id } });
      if (pos) await pos.update(position);
      else await WidgetPosition.create({ widgetId: id, ...position });
    }

    if (style) {
      const sty = await WidgetStyle.findOne({ where: { widgetId: id } });
      if (sty) await sty.update(style);
      else await WidgetStyle.create({ widgetId: id, ...style });
    }

    res.json({ message: 'Widget updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update widget' });
  }
};

// Delete single widget
exports.deleteWidget = async (req, res) => {
  try {
    const { id } = req.params; // widget id
    await Widget.destroy({ where: { id } });
    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete widget' });
  }
};

// Full builder project JSON (Canva-style editor state)
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

// Upload Image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
