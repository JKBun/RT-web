const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    return res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { avenueId, title, impactSummary, fundsRaised, featuredImage } = req.body;
    if (!title || !impactSummary) {
      return res.status(400).json({ success: false, error: 'Title and impact summary are required.' });
    }

    const project = await Project.create({ avenueId, title, impactSummary, fundsRaised, featuredImage });
    return res.status(201).json({ success: true, message: 'Project published successfully!', project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
