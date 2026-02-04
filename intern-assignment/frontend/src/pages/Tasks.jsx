import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    const trimmedTitle = newTaskTitle.trim();

    try {
      const res = await api.post('/tasks', {
        title: trimmedTitle || 'Untitled Task',
      });

      setTasks([res.data.task, ...tasks]);
      setNewTaskTitle('');
      toast.success('Task added!');
    } catch (error) {
      console.error('Add task error:', error);
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const trimmedTitle = editTitle.trim();
      const finalTitle = trimmedTitle !== '' ? trimmedTitle : 'Untitled Task';

      const res = await api.put(`/tasks/${taskId}`, {
        title: finalTitle,
      });

      setTasks(tasks.map((task) => 
        task._id === taskId ? res.data.task : task
      ));

      setEditingTask(null);
      setEditTitle('');
      toast.success('Task updated!');
    } catch (error) {
      console.error('Update task error:', error);
      toast.error('Failed to update task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/toggle`);

      setTasks(tasks.map((task) => 
        task._id === taskId ? res.data.task : task
      ));

      const task = res.data.task;
      toast.success(task.completed ? 'Task completed!' : 'Task reopened!');
    } catch (error) {
      console.error('Toggle task error:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted!');
    } catch (error) {
      console.error('Delete task error:', error);
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold mb-8">My Tasks</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <p className="text-4xl font-bold">{totalTasks}</p>
            <p className="text-gray-400 mt-2">Total Tasks</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6"
          >
            <p className="text-4xl font-bold text-emerald-400">{activeTasks}</p>
            <p className="text-gray-400 mt-2">Active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6"
          >
            <p className="text-4xl font-bold text-purple-400">{completedTasks}</p>
            <p className="text-gray-400 mt-2">Completed</p>
          </motion.div>
        </div>

        {/* Add Task Input */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="What needs to be done?"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddTask}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-semibold transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({totalTasks})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              filter === 'active'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active ({activeTasks})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {filter === 'all' 
                ? 'No tasks yet. Add one above!'
                : `No ${filter} tasks`}
            </div>
          ) : (
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4"
                >
                  <button
                    onClick={() => handleToggleComplete(task._id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-white/30 hover:border-emerald-500'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1">
                    {editingTask === task._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleUpdateTask(task._id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                    ) : (
                      <p
                        className={`text-lg ${
                          task.completed ? 'line-through text-gray-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingTask === task._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}