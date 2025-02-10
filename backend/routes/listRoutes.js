// routes/listRoutes.js
const express = require('express');
const router = express.Router();
const { createList, updateList, deleteList } = require('../controllers/listController');

// POST /api/lists
router.post('/', createList);

// PUT /api/lists/:id
router.put('/:id', updateList);

// DELETE /api/lists/:id
router.delete('/:id', deleteList);

module.exports = router;