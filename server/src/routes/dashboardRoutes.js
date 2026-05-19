const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const multer = require('multer');
const path = require('path');

// Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/dashboards', dashboardController.createDashboard);
router.get('/dashboards/:id', dashboardController.getDashboard);
router.put('/dashboards/:id/layout', dashboardController.saveLayout);

router.put('/widgets/:id', dashboardController.updateWidget);
router.delete('/widgets/:id', dashboardController.deleteWidget);

router.post('/upload', upload.single('image'), dashboardController.uploadImage);

module.exports = router;
