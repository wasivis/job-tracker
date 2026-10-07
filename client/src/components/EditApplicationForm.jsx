import { useState } from "react";
import { apiRequest } from "../api/api";

function EditApplicationForm({
  application,
  onApplicationUpdated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    company: application.company || "",
    jobTitle: application.jobTitle || "",
    location: application.location || "",
    applicationDate: application.applicationDate
      ? application.applicationDate.split("T")[0]
      : "",
    jobUrl: application.jobUrl || "",
    recruiterName: application.recruiterName || "",
    recruiterEmail: application.recruiterEmail || "",
    notes: application.notes || "",
    status: application.status || "Saved",
  });

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
      const updatedApplication = await apiRequest(
        `/api/applications/${application._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      onApplicationUpdated(updatedApplication);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClasses =
    "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Edit Application
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Update the details for this application.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClasses}>
              Company *
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>
              Job Title *
            </label>

            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Application Date
            </label>

            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Job URL
            </label>

            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Status
            </label>

            <select
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
        </div>

        <div className="border-t pt-6">
          <h4 className="mb-4 text-sm font-semibold text-gray-900">
            Recruiter Information
          </h4>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClasses}>
                Recruiter Name
              </label>

              <input
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Recruiter Email
              </label>

              <input
                type="email"
                name="recruiterEmail"
                value={formData.recruiterEmail}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditApplicationForm;