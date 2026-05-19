const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
require('./models'); // Load models and associations
const dashboardRoutes = require('./routes/dashboardRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api', dashboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sync database and start server
db.sync({ alter: true }) // Using alter to safely sync schemas without dropping
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
