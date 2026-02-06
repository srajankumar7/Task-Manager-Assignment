const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// ✅ Database connection (DEPLOYMENT SAFE)
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in environment variables');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// ✅ Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Server error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
