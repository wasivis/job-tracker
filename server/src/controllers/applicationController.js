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
  const application = await JobApplication.create({
    ...req.body,
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
  } = req.body;

  const application = await JobApplication.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.userId,
    },
    {
      company,
      jobTitle,
      location,
      applicationDate,
      jobUrl,
      recruiterName,
      recruiterEmail,
      notes,
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

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