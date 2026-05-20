const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const multer = require('multer');
const path = require('path');
const { UPLOADS_DIR, ensureUploadsDir } = require('../config/uploads');

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/dashboards', dashboardController.createDashboard);
router.get('/dashboards/:id', dashboardController.getDashboard);
router.get('/dashboards/:id/project', dashboardController.getProject);
router.put('/dashboards/:id/project', dashboardController.saveProject);
router.put('/dashboards/:id/layout', dashboardController.saveLayout);

router.put('/widgets/:id', dashboardController.updateWidget);
router.delete('/widgets/:id', dashboardController.deleteWidget);

router.post('/upload', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    next();
  });
}, dashboardController.uploadImage);

module.exports = router;
