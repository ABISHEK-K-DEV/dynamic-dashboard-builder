const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboards/:id/project', dashboardController.getProject);
router.put('/dashboards/:id/project', dashboardController.saveProject);

module.exports = router;
