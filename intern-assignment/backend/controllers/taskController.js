const Task = require('../models/Task');

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    // ✅ Use "Untitled Task" if no title provided
    const taskTitle = title && title.trim() !== '' ? title : 'Untitled Task';

    const task = await Task.create({
      title: taskTitle,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user.id, // ✅ Associate task with logged-in user
      status: 'active',
      completed: false,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, completed, dueDate } = req.body;

    // ✅ Find task and verify ownership
    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Check if task belongs to logged-in user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // ✅ Prevent empty title, use "Untitled Task"
    if (title !== undefined) {
      task.title = title.trim() !== '' ? title : 'Untitled Task';
    }

    // ✅ Update fields if provided
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    
    // ✅ Handle completed status
    if (completed !== undefined) {
      task.completed = completed;
      task.status = completed ? 'completed' : 'active';
    }
    
    // ✅ Handle status directly
    if (status !== undefined) {
      task.status = status;
      task.completed = status === 'completed';
    }

    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find task and verify ownership
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Check if task belongs to logged-in user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    // ✅ Delete task
    await Task.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

// Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find task and verify ownership
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // ✅ Check if task belongs to logged-in user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // ✅ Toggle completed status
    task.completed = !task.completed;
    task.status = task.completed ? 'completed' : 'active';

    await task.save();

    res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.error('Toggle completion error:', err);
    res.status(500).json({ message: 'Failed to toggle task completion' });
  }
};