const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();

    console.log('Data cleared...');

    // Create demo users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Full-stack developer passionate about creating efficient solutions',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Project manager with 5 years of experience',
      },
    ]);

    console.log('Users created...');

    // Create demo tasks for first user
    const tasks = await Task.create([
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature',
        status: 'in-progress',
        priority: 'high',
        user: users[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests from team members',
        status: 'pending',
        priority: 'medium',
        user: users[0]._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Update dependencies',
        description: 'Update all npm packages to latest stable versions',
        status: 'completed',
        priority: 'low',
        user: users[0]._id,
      },
      {
        title: 'Fix authentication bug',
        description: 'Users reporting issues with login on mobile devices',
        status: 'pending',
        priority: 'high',
        user: users[0]._id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Optimize database queries',
        description: 'Improve performance of slow running queries',
        status: 'in-progress',
        priority: 'medium',
        user: users[0]._id,
      },
    ]);

    console.log('Tasks created...');
    console.log('\n=== DEMO CREDENTIALS ===');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('\nEmail: jane@example.com');
    console.log('Password: password123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();