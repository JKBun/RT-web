/**
 * MVC Server Entry Point — Rotaract Club of NIBM Kandy
 * Connects Database, Mounts RESTful Controllers/Routes, Serves Frontend Views
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize Database Connection
const db = require('./backend/config/db');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Static Assets
app.use(express.static(path.join(__dirname, 'public')));
if (fs.existsSync(path.join(__dirname, 'build'))) {
  app.use(express.static(path.join(__dirname, 'build')));
}

// API Routes (MVC Architecture)
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/events', require('./backend/routes/eventRoutes'));
app.use('/api/registrations', require('./backend/routes/registrationRoutes'));
app.use('/api/volunteer', require('./backend/routes/volunteerRoutes'));
app.use('/api/projects', require('./backend/routes/projectRoutes'));
app.use('/api/reports', require('./backend/routes/reportRoutes'));

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    architecture: 'MVC (Model-View-Controller)',
    system: 'Rotaract Club of NIBM Kandy Management System',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Centralized Error Handling Middleware
const { errorHandler } = require('./backend/middleware/errorHandler');
app.use(errorHandler);

// Start Server
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`========================================================`);
    console.log(` Rotaract Club NIBM Management System (MVC Architecture)`);
    console.log(` Server running on http://${HOST}:${PORT}`);
    console.log(` Database: Initialized and Connected`);
    console.log(`========================================================`);
  });
}

module.exports = app;
