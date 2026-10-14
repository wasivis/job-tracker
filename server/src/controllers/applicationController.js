
const JobApplication = require("../models/JobApplication");

// GET /api/applications
const getApplications = async (req, res) => {
  const applications = await JobApplication.find({
    user: req.user.userId,
  }).sort({
    applicationDate: -1,
  });

  res.json(applications);
};

// GET /api/applications/:id
const getApplication = async (req, res) => {
  const application = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  res.json(application);
};

// POST /api/applications
const createApplication = async (req, res) => {
  const {
    company,
    jobTitle,
    location,
    applicationDate,
    jobUrl,
    recruiterName,
    recruiterEmail,
    notes,
    status,
    followUpDate,
    followUpCompleted,
  } = req.body;

  const application = await JobApplication.create({
    company,
    jobTitle,
    location,
    applicationDate,
    jobUrl,
    recruiterName,
    recruiterEmail,
    notes,
    status,
    followUpDate,
    followUpCompleted,
    user: req.user.userId,
  });

  res.status(201).json(application);
};

// PUT /api/applications/:id
const updateApplication = async (req, res) => {
  const {
    company,
    jobTitle,
    location,
    applicationDate,
    jobUrl,
    recruiterName,
    recruiterEmail,
    notes,
    status,
    followUpDate,
    followUpCompleted,
  } = req.body;

  const application = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  if (company !== undefined) {
    application.company = company;
  }

  if (jobTitle !== undefined) {
    application.jobTitle = jobTitle;
  }

  if (location !== undefined) {
    application.location = location;
  }

  if (applicationDate !== undefined) {
    application.applicationDate = applicationDate;
  }

  if (jobUrl !== undefined) {
    application.jobUrl = jobUrl;
  }

  if (recruiterName !== undefined) {
    application.recruiterName = recruiterName;
  }

  if (recruiterEmail !== undefined) {
    application.recruiterEmail = recruiterEmail;
  }

  if (notes !== undefined) {
    application.notes = notes;
  }

  if (status !== undefined) {
    application.status = status;
  }

  if (followUpDate !== undefined) {
    application.followUpDate = followUpDate || null;
  }

  if (followUpCompleted !== undefined) {
    application.followUpCompleted = followUpCompleted;
  }

  await application.save();

  res.json(application);
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  const application = await JobApplication.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  res.json({
    message: "Application deleted successfully",
  });
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};
