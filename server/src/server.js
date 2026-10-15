const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const { handleStripeWebhook } = require("./controllers/billingController");
const asyncHandler = require("./utils/asyncHandler");
const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(handleStripeWebhook)
);

app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    message: "Job Application Tracker API is running!",
  });
});

app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});