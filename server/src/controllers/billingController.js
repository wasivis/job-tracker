const Stripe = require("stripe");
const mongoose = require("mongoose");
const User = require("../models/User");

const PREMIUM_STATUSES = new Set(["active", "trialing"]);
const OPEN_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "incomplete",
  "paused",
]);

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getUserId = (req) => req.user.userId;

const createCheckoutSession = async (req, res) => {
  if (!process.env.STRIPE_PREMIUM_PRICE_ID) {
    return res.status(503).json({
      message: "Premium checkout is not configured yet.",
    });
  }

  const user = await User.findById(getUserId(req));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.plan === "premium") {
    return res.status(409).json({
      message: "Your account already has Premium access.",
    });
  }

  if (
    user.stripeSubscriptionId &&
    OPEN_SUBSCRIPTION_STATUSES.has(user.stripeSubscriptionStatus)
  ) {
    return res.status(409).json({
      message:
        "You already have a subscription to manage. Use the billing portal instead.",
    });
  }

  const stripe = getStripe();
  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create(
      {
        email: user.email,
        name: user.name,
        metadata: { userId: String(user._id) },
      },
      { idempotencyKey: `job-tracker-customer-${user._id}` }
    );

    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL must be configured for Stripe checkout.");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: String(user._id),
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID,
        quantity: 1,
      },
    ],
    metadata: { userId: String(user._id) },
    subscription_data: {
      metadata: { userId: String(user._id) },
    },
    success_url: `${clientUrl}/settings?checkout=success`,
    cancel_url: `${clientUrl}/settings?checkout=cancelled`,
  });

  res.json({ url: session.url });
};

const createPortalSession = async (req, res) => {
  const user = await User.findById(getUserId(req));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.stripeCustomerId) {
    return res.status(400).json({
      message: "No Stripe billing account is associated with this user.",
    });
  }

  if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL must be configured for the billing portal.");
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.CLIENT_URL}/settings?billing=return`,
  });

  res.json({ url: session.url });
};

const syncSubscription = async (stripe, subscription, fallbackUserId) => {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
  const userId = subscription.metadata?.userId || fallbackUserId;
  const lookup = [];

  if (customerId) {
    lookup.push({ stripeCustomerId: customerId });
  }

  if (subscription.id) {
    lookup.push({ stripeSubscriptionId: subscription.id });
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    lookup.push({ _id: userId });
  }

  if (!lookup.length) {
    return;
  }

  const currentSubscription = await stripe.subscriptions.retrieve(
    subscription.id
  );
  const isPremium = PREMIUM_STATUSES.has(currentSubscription.status);
  const periodEnd = currentSubscription.current_period_end;
  const user = await User.findOne({ $or: lookup });

  if (!user) {
    return;
  }

  if (
    user.stripeSubscriptionId &&
    user.stripeSubscriptionId !== currentSubscription.id
  ) {
    const currentPeriodEnd = user.stripeCurrentPeriodEnd?.getTime();
    const nextPeriodEnd = periodEnd ? periodEnd * 1000 : null;

    if (
      (user.plan === "premium" && !isPremium) ||
      (user.plan === "premium" &&
        isPremium &&
        currentPeriodEnd &&
        nextPeriodEnd &&
        nextPeriodEnd <= currentPeriodEnd)
    ) {
      return;
    }
  }

  const update = {
    plan: isPremium ? "premium" : "free",
    stripeSubscriptionId: currentSubscription.id,
    stripeSubscriptionStatus: currentSubscription.status,
    stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    stripeCancelAtPeriodEnd: Boolean(
      currentSubscription.cancel_at_period_end
    ),
  };

  if (customerId) {
    update.stripeCustomerId = customerId;
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: update },
    { new: true, runValidators: true }
  );
};

const handleStripeWebhook = async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({
      message: "Stripe webhooks are not configured.",
    });
  }

  const stripe = getStripe();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).json({
      message: `Invalid Stripe webhook signature: ${error.message}`,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.mode === "subscription" && session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId
      );

      await syncSubscription(stripe, subscription, session.metadata?.userId);
    }
  } else if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await syncSubscription(stripe, event.data.object);
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  createPortalSession,
  handleStripeWebhook,
};
