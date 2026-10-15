const User = require("../models/User");

const requirePremiumForFollowUps = async (req, res, next) => {
  const isCreatingReminder =
    req.method === "POST" &&
    (Boolean(req.body.followUpDate) || req.body.followUpCompleted === true);
  const isChangingReminder =
    req.method === "PUT" &&
    (Object.prototype.hasOwnProperty.call(req.body, "followUpDate") ||
      Object.prototype.hasOwnProperty.call(
        req.body,
        "followUpCompleted"
      ));

  if (!isCreatingReminder && !isChangingReminder) {
    return next();
  }

  const user = await User.findById(req.user.userId).select("plan");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.plan !== "premium") {
    return res.status(403).json({
      code: "PREMIUM_REQUIRED",
      message: "Follow-up reminders are available on the Premium plan.",
    });
  }

  return next();
};

module.exports = requirePremiumForFollowUps;
