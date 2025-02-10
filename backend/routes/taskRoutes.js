// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask, moveTask } = require('../controllers/taskController');

// POST /api/tasks
router.post('/',  createTask);

// PUT /api/tasks/:id
router.put('/:id',  updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

// POST /api/tasks/move (drag and drop)
router.post('/move', moveTask);

module.exports = router;