// 💍 SITE ROUTES

const express = require('express');
const router = express.Router();
const SiteController = require('../controllers/site.controller');

// GET /api/sites/public/:slug - Get published site (public)
router.get('/public/:slug', SiteController.getPublishedSite);

// GET /api/sites - Get all sites
router.get('/', SiteController.getAllSites);

// GET /api/sites/:id - Get single site
router.get('/:id', SiteController.getSite);

// POST /api/sites - Create new site
router.post('/', SiteController.createSite);

// PATCH /api/sites/:id - Update site
router.patch('/:id', SiteController.updateSite);

// POST /api/sites/:id/publish - Publish site
router.post('/:id/publish', SiteController.publishSite);

// POST /api/sites/:id/unpublish - Unpublish site
router.post('/:id/unpublish', SiteController.unpublishSite);

// DELETE /api/sites/:id - Delete site
router.delete('/:id', SiteController.deleteSite);

// POST /api/sites/:id/rsvp - Submit RSVP (public)
router.post('/:id/rsvp', SiteController.submitRSVP);

// GET /api/sites/:id/rsvp - Get RSVP responses (owner)
router.get('/:id/rsvp', SiteController.getRSVPResponses);

module.exports = router;
