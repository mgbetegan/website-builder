const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/project.routes');
const guestBookRoutes = require('./routes/guestbook.routes');
const templateRoutes = require('./routes/template.routes');
const siteRoutes = require('./routes/site.routes');
const pageRoutes = require('./routes/page.routes');
const navigationRoutes = require('./routes/navigation.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/guestbooks', guestBookRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/sites', siteRoutes);
// v2+ routes (nested under /api/sites/:siteId)
app.use('/api/sites/:siteId/pages', pageRoutes);
app.use('/api/sites/:siteId/navigation', navigationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Website Builder API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      guestbooks: '/api/guestbooks',
      templates: '/api/templates',
      sites: '/api/sites',
      pages: '/api/sites/:siteId/pages',
      navigation: '/api/sites/:siteId/navigation',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Website Builder API Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Base: http://localhost:${PORT}/api`);
  console.log(`\n⏰ Started at: ${new Date().toISOString()}\n`);
});

module.exports = app;
