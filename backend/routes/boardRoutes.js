const express = require('express');
const router = express.Router();
const { getBoard, updateBoard } = require('../controllers/boardController');

// GET /api/board
router.get('/', getBoard);

// PUT /api/board
router.put('/', updateBoard);

module.exports = router;