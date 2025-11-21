// 📄 PAGE ROUTES (v2+)

const express = require('express');
const router = express.Router({ mergeParams: true });
const PageController = require('../controllers/page.controller');

// Pages
router.get('/', PageController.getAllPages);
router.post('/', PageController.createPage);
router.post('/reorder', PageController.reorderPages);
router.get('/:pageId', PageController.getPage);
router.patch('/:pageId', PageController.updatePage);
router.delete('/:pageId', PageController.deletePage);

// Blocks
router.post('/:pageId/blocks', PageController.addBlock);
router.patch('/:pageId/blocks/:blockId', PageController.updateBlock);
router.delete('/:pageId/blocks/:blockId', PageController.removeBlock);
router.post('/:pageId/blocks/reorder', PageController.reorderBlocks);

module.exports = router;
