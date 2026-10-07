# Job Application Tracker

A full-stack web application for managing and tracking job applications throughout the hiring process.

## Features

* User registration and secure login
* JWT-based authentication
* Create, view, edit, and delete job applications
* Application statuses:

  * Saved
  * Applied
  * Assessment
  * Interview
  * Offer
  * Rejected
  * Hired
* Search applications
* Filter applications by status
* Sort applications
* Dashboard metrics
* Recruiter information
* Job posting URLs
* Notes for each application
* Account settings
* Permanent account deletion
* User-specific application data
* Backend validation
* Protected API routes

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs

## Project Structure

```text
job-application-tracker/
├── client/
│   └── React frontend
├── server/
│   └── Express REST API
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

* Node.js
* MongoDB Atlas account
* npm

### Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd job-application-tracker
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

```bash
cd ../server
npm install
```

### Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Run the backend

From `server/`:

```bash
npm run dev
```

### Run the frontend

From `client/`:

```bash
npm run dev
```

The frontend will be available at:

http://localhost:5173

The backend will run at:

http://localhost:5000

## API Overview

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
DELETE /api/auth/account
```

### Applications

```text
GET    /api/applications
GET    /api/applications/:id
POST   /api/applications
PUT    /api/applications/:id
DELETE /api/applications/:id
```

## Security

* Passwords are hashed with bcrypt
* JWT authentication protects private routes
* Users can only access their own applications
* Backend validation protects application data
* Environment variables are excluded from Git
* Production CORS is restricted to the frontend origin

## Future Improvements

Possible future features include:

* Follow-up reminders
* Application analytics and charts
* Resume storage
* Email notifications
* Calendar integration
* Advanced application statistics

## License

This project is for educational and portfolio purposes.