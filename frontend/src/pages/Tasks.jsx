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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold text-slate-800 mb-10"
        >
          My Tasks
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-semibold text-slate-800">{totalTasks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-3xl font-semibold text-slate-800">{activeTasks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-semibold text-slate-800">{completedTasks}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Task Input */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="What needs to be done?"
                className="w-full px-5 py-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
              />
            </div>
            <button
              onClick={handleAddTask}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Add Task
            </button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All ({totalTasks})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'active'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            Active ({activeTasks})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'completed'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
              <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-700 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white border border-slate-200 rounded-xl"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-600">
                {filter === 'all' 
                  ? 'No tasks yet. Add one above!'
                  : `No ${filter} tasks`}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-5 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(task._id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed
                        ? 'bg-teal-600 border-teal-600'
                        : 'border-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task Title */}
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        autoFocus
                      />
                    ) : (
                      <p
                        className={`text-lg ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editingTask === task._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateTask(task._id)}
                          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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