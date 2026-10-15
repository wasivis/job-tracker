
import { useState } from "react";
import { apiRequest } from "../api/api";
import PremiumNotice from "./dashboard/PremiumNotice";

const initialFormData = {
  company: "",
  jobTitle: "",
  location: "",
  applicationDate: "",
  jobUrl: "",
  recruiterName: "",
  recruiterEmail: "",
  notes: "",
  status: "Saved",
  followUpDate: "",
};

function ApplicationForm({ onApplicationCreated, canUseFollowUps = false }) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const { followUpDate, ...applicationData } = formData;
      const newApplication = await apiRequest(
        "/api/applications",
        {
          method: "POST",
          body: JSON.stringify({
            ...applicationData,
            ...(canUseFollowUps
              ? {
                  followUpDate: followUpDate || null,
                  followUpCompleted: false,
                }
              : {}),
          }),
        }
      );

      onApplicationCreated(newApplication);

      setFormData(initialFormData);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-[#dfe6dd] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition placeholder:text-[#9aa69c] focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]";

  const labelClasses =
    "mb-1.5 block text-sm font-semibold text-[#52665a]";

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#20392e]">
          Add Application
        </h2>

        <p className="mt-1 text-sm text-[#7b8a7f]">
          Keep track of a new job opportunity.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClasses} htmlFor="add-company">
              Company *
            </label>

            <input
              id="add-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="add-jobTitle">
              Job Title *
            </label>

            <input
              id="add-jobTitle"
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="add-location">
              Location
            </label>

            <input
              id="add-location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Buenos Aires / Remote"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="add-applicationDate">
              Application Date
            </label>

            <input
              id="add-applicationDate"
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="add-jobUrl">
              Job URL
            </label>

            <input
              id="add-jobUrl"
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="add-status">
              Status
            </label>

            <select
              id="add-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          {canUseFollowUps ? (
            <div>
              <label className={labelClasses} htmlFor="add-followUpDate">
                Follow-up Date
              </label>
              <input
                id="add-followUpDate"
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className={inputClasses}
              />
              <p className="mt-1.5 text-xs text-[#87958b]">
                Optional. Set a date to remind yourself to follow up.
              </p>
            </div>
          ) : (
            <PremiumNotice compact>
              Get a nudge when it’s time to reconnect.
            </PremiumNotice>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="mb-4 text-sm font-bold text-[#35483b]">
            Recruiter Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClasses} htmlFor="add-recruiterName">
                Recruiter Name
              </label>

              <input
                id="add-recruiterName"
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                placeholder="e.g. Jane Smith"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses} htmlFor="add-recruiterEmail">
                Recruiter Email
              </label>

              <input
                id="add-recruiterEmail"
                type="email"
                name="recruiterEmail"
                value={formData.recruiterEmail}
                onChange={handleChange}
                placeholder="jane@company.com"
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses} htmlFor="add-notes">
            Notes
          </label>

          <textarea
            id="add-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add anything you want to remember about this application..."
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end border-t pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#285a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e4935] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Application"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ApplicationForm;
