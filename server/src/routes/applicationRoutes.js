const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All application routes require authentication
router.use(protect);

router.get("/", asyncHandler(getApplications));
router.get("/:id", asyncHandler(getApplication));
router.post("/", asyncHandler(createApplication));
router.put("/:id", asyncHandler(updateApplication));
router.delete("/:id", asyncHandler(deleteApplication));

module.exports = router;