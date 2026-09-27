/**
 * MVC Server Entry Point — Rotaract Club of NIBM Kandy
 * ==============================================================
 * 5-Folder Clean Architecture:
 * - models/      -> Domain Entity Models
 * - views/       -> React UI Views & Frontend Assets
 * - controllers/ -> Express Controllers & REST API Routes
 * - database/    -> MySQL Pool Connection & Schemas
 * - photos/      -> Photos, Logos & Brand Assets
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// 1. Initialize Database Connection (from database/ folder)
const db = require('./database/db');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve Static Photos & Assets with browser cache optimization
app.use('/photos', express.static(path.join(__dirname, 'photos'), { maxAge: '1d', etag: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d', etag: true }));
if (fs.existsSync(path.join(__dirname, 'build'))) {
  app.use(express.static(path.join(__dirname, 'build'), { maxAge: '1d', etag: true }));
}

// 3. Mount MVC API Routes (from controllers/routes/)
app.use('/api/auth', require('./controllers/routes/authRoutes'));
app.use('/api/events', require('./controllers/routes/eventRoutes'));
app.use('/api/registrations', require('./controllers/routes/registrationRoutes'));
app.use('/api/volunteer', require('./controllers/routes/volunteerRoutes'));
app.use('/api/projects', require('./controllers/routes/projectRoutes'));
app.use('/api/reports', require('./controllers/routes/reportRoutes'));
app.use('/api/gallery', require('./controllers/routes/galleryRoutes'));

// 4. System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    architecture: '5-Folder MVC Architecture (models, views, controllers, database, photos)',
    system: 'Rotaract Club of NIBM Kandy Management System',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// 4.1 SPA Production Client-Side Route Fallback
if (fs.existsSync(path.join(__dirname, 'build'))) {
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/') || req.path.startsWith('/photos/')) return next();
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// 5. Centralized Error Handling Middleware
const { errorHandler } = require('./controllers/middleware/errorHandler');
app.use(errorHandler);

// Start Server
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log('========================================================');
    console.log(' Rotaract Club NIBM Management System (5-Folder MVC)');
    console.log(` Server running on http://${HOST}:${PORT}`);
    console.log(' Database: Connected (database/db.js)');
    console.log(' Photos: Mounted at /photos (photos/ folder)');
    console.log('========================================================');
  });
}

module.exports = app;
