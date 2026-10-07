const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
      minlength: [1, "Company cannot be empty"],
      maxlength: [100, "Company cannot exceed 100 characters"],
    },

    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [1, "Job title cannot be empty"],
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },

    jobUrl: {
      type: String,
      trim: true,
      maxlength: [500, "Job URL cannot exceed 500 characters"],
    },

    recruiterName: {
      type: String,
      trim: true,
      maxlength: [100, "Recruiter name cannot exceed 100 characters"],
    },

    recruiterEmail: {
      type: String,
      trim: true,
      maxlength: [254, "Recruiter email cannot exceed 254 characters"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "Saved",
          "Applied",
          "Assessment",
          "Interview",
          "Offer",
          "Rejected",
          "Hired",
        ],
        message: "Invalid application status",
      },
      default: "Saved",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);