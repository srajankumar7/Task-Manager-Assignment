Task Manager – Auth & Dashboard Assignment

A full-stack Task Manager web application built as part of the Frontend Developer Intern – Shortlisting Assignment.
The project focuses on modern frontend UX, secure authentication, and clean frontend–backend integration.

📌 Project Overview

This application allows users to:
Sign up and log in securely
Access a protected dashboard after authentication
Manage tasks with full CRUD operations
View and update their profile
Experience smooth UI states (loading, success, error)
The frontend is the primary focus, with a minimal but secure backend supporting it.

🧱 Tech Stack
Frontend
React.js (Vite)
Tailwind CSS
React Router DOM
Axios
Framer Motion
React Hot Toast

Backend
Node.js
Express.js
MongoDB + Mongoose
JWT (JSON Web Tokens)
bcryptjs

✨ Features Implemented
🔐 Authentication
Signup & Login APIs
Password hashing using bcrypt
JWT-based authentication
Token stored securely in localStorage
Protected routes using auth middleware

📊 Dashboard
Accessible only after login
Displays:
User greeting
Task statistics (total / active / completed)
Recent tasks
Quick navigation to Tasks & Profile

✅ Task Management (CRUD)
Create new tasks
View task list
Update task status (active / completed)
Delete tasks
Search & filter tasks (frontend)

👤 Profile
Fetch user profile from backend
Update user details
Secure access via JWT

🎨 UI / UX
Fully responsive design
Loading states
Error & success messages
Smooth animations with Framer Motion
Clean, professional layout



⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/srajankumar7/Task-Manager-Assignment.git
cd Task-Manager-Assignment

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:
npm run dev


Backend will run at:
http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev


Frontend will run at:
http://localhost:3000

🔗 API Endpoints (v1)
Auth
POST /api/v1/auth/signup
POST /api/v1/auth/login

Profile:
GET /api/v1/me
PUT /api/v1/me

Tasks:
POST /api/v1/tasks
GET /api/v1/tasks

GET /api/v1/tasks/:id
PUT /api/v1/tasks/:id

DELETE /api/v1/tasks/:id
