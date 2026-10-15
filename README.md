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
* Follow-up reminders
* Dashboard metrics
* Recruiter information
* Multiple interview rounds per application, including dates, interviewers, notes, and outcomes
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

Create `server/.env` (see [`server/.env.example`](./server/.env.example)
for the complete list):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
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

### Billing

```text
POST /api/billing/checkout-session
POST /api/billing/portal-session
POST /api/billing/webhook
```

## Security

* Passwords are hashed with bcrypt
* JWT authentication protects private routes
* Users can only access their own applications
* Backend validation protects application data
* Environment variables are excluded from Git
* Production CORS is restricted to the frontend origin

## Stripe Billing and Follow-up Reminders

New accounts start on the `free` plan. The server enforces the plan when a
follow-up reminder is created or changed; the client only uses the plan value
to explain and disable the corresponding controls. Existing reminders remain
visible to free-plan users.

Premium is a USD $5/month subscription through Stripe Checkout. To configure
Stripe in test mode:

1. In the Stripe Dashboard, create a recurring product price for Premium at
   `$5 USD` per month and copy its `price_...` ID into
   `STRIPE_PREMIUM_PRICE_ID`.
2. Put a **rotated** test secret key in `STRIPE_SECRET_KEY`. Keep Stripe keys
   server-side; never add them to client environment variables or source
   control. This uses Stripe-hosted Checkout, so the publishable key is not
   needed in the frontend.
3. For local webhook testing, run
   `stripe listen --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted --forward-to localhost:5000/api/billing/webhook`
   and set the CLI-provided signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Enable the Stripe customer portal in the Dashboard's test-mode Billing
   settings. Premium members can use it to manage or cancel their subscription.
5. Use Stripe test card `4242 4242 4242 4242`, any future expiry, and any CVC
   to test Checkout. Never use real card details in test mode.

For deployment, configure the same environment variables with live-mode Stripe
credentials and register the deployed `/api/billing/webhook` URL in Stripe.
Webhook signatures are verified before any subscription can change a user's
plan. Account deletion cancels an associated Stripe subscription first.

## Future Improvements

Possible future features include:

* Application analytics and charts
* Resume storage
* Email notifications
* Calendar integration
* Advanced application statistics

## License

This project is for educational and portfolio purposes.