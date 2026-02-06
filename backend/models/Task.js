const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Task',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // ✅ Each task must belong to a user
  },
}, {
  timestamps: true,
});

// ✅ Index for faster queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);