const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  plan: user.plan || "free",
  subscriptionStatus: user.stripeSubscriptionStatus,
  currentPeriodEnd: user.stripeCurrentPeriodEnd,
  cancelAtPeriodEnd: user.stripeCancelAtPeriodEnd,
  hasBillingAccount: Boolean(user.stripeCustomerId),
});

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: "A user with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: toPublicUser(user),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    message: "Login successful",
    token,
    user: toPublicUser(user),
  });
};

const deleteAccount = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (
    user.stripeSubscriptionId &&
    user.stripeSubscriptionStatus !== "canceled" &&
    user.stripeSubscriptionStatus !== "incomplete_expired"
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "Cannot delete an account with a Stripe subscription until Stripe is configured."
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await stripe.subscriptions.cancel(user.stripeSubscriptionId);
  }

  await JobApplication.deleteMany({
    user: userId,
  });

  await User.findByIdAndDelete(userId);

  res.json({
    message: "Account deleted successfully",
  });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password"
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    user: toPublicUser(user),
  });
};

module.exports = {
  register,
  login,
  deleteAccount,
  getCurrentUser,
};