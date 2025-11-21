// 🧭 NAVIGATION ROUTES (v2+)

const express = require('express');
const router = express.Router({ mergeParams: true });
const NavigationController = require('../controllers/navigation.controller');

router.get('/', NavigationController.getNavigation);
router.patch('/', NavigationController.updateNavigation);

module.exports = router;
