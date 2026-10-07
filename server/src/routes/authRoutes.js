const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const {
  register,
  login,
  deleteAccount,
  getCurrentUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

router.get("/me", protect, asyncHandler(getCurrentUser));

router.delete(
  "/account",
  protect,
  asyncHandler(deleteAccount)
);

module.exports = router;