const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  createPortalSession,
} = require("../controllers/billingController");

const router = express.Router();

router.use(protect);
router.post("/checkout-session", asyncHandler(createCheckoutSession));
router.post("/portal-session", asyncHandler(createPortalSession));

module.exports = router;
