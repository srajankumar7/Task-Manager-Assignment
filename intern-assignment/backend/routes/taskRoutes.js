const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ✅ All routes are protected - user must be logged in
router.use(protect);

// Task CRUD routes
router.get('/', getTasks);                    // GET /api/v1/tasks
router.post('/', createTask);                 // POST /api/v1/tasks
router.put('/:id', updateTask);               // PUT /api/v1/tasks/:id
router.delete('/:id', deleteTask);            // DELETE /api/v1/tasks/:id
router.patch('/:id/toggle', toggleTaskCompletion); // PATCH /api/v1/tasks/:id/toggle

module.exports = router;