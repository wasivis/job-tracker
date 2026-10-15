
import { useState } from "react";
import { apiRequest } from "../api/api";
import PremiumNotice from "./dashboard/PremiumNotice";

function EditApplicationForm({
  application,
  onApplicationUpdated,
  onCancel,
  canUseFollowUps = false,
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
    followUpDate: application.followUpDate
      ? application.followUpDate.split("T")[0]
      : "",
    followUpCompleted: application.followUpCompleted || false,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,

      // A new follow-up date means the reminder is active again.
      ...(name === "followUpDate"
        ? { followUpCompleted: false }
        : {}),
    }));
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
          body: JSON.stringify({
            ...formData,
            ...(canUseFollowUps
              ? { followUpDate: formData.followUpDate || null }
              : {
                  followUpDate: undefined,
                  followUpCompleted: undefined,
                }),
          }),
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
    "w-full rounded-xl border border-[#dfe6dd] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition placeholder:text-[#9aa69c] focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]";

  const labelClasses =
    "mb-1.5 block text-sm font-semibold text-[#52665a]";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-[#20392e]">
          Edit Application
        </h3>

        <p className="mt-1 text-sm text-[#7b8a7f]">
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
            <label className={labelClasses} htmlFor="edit-company">
              Company *
            </label>
            <input
              id="edit-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="edit-jobTitle">
              Job Title *
            </label>
            <input
              id="edit-jobTitle"
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="edit-location">
              Location
            </label>
            <input
              id="edit-location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="edit-applicationDate">
              Application Date
            </label>
            <input
              id="edit-applicationDate"
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="edit-jobUrl">
              Job URL
            </label>
            <input
              id="edit-jobUrl"
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses} htmlFor="edit-status">
              Status
            </label>
            <select
              id="edit-status"
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

        {/* Follow-up reminder */}
        {canUseFollowUps ? (
          <div className="rounded-2xl border border-[#dce8d9] bg-[#f5f8f2] p-4">
            <h4 className="text-sm font-bold text-[#35483b]">
              Follow-up Reminder
            </h4>
            <p className="mt-1 mb-4 text-sm text-[#7b8a7f]">
              Set a date to remind yourself to contact the employer.
              Changing the date reactivates a completed reminder.
            </p>
            <label className={labelClasses} htmlFor="edit-followUpDate">
              Follow-up date
            </label>
            <input
              id="edit-followUpDate"
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className={inputClasses}
            />
            <p className="mt-2 text-xs text-[#87958b]">
              Leave the date empty to remove the reminder.
            </p>
            {application.followUpCompleted &&
              formData.followUpDate ===
                (application.followUpDate
                  ? application.followUpDate.split("T")[0]
                  : "") && (
                <p className="mt-2 text-xs font-semibold text-[#42724f]">
                  This reminder is completed. Choose a new date to reactivate
                  it.
                </p>
              )}
          </div>
        ) : (
          <PremiumNotice>
            {application.followUpDate
              ? "Your existing reminder stays visible on your application, but only Premium members can change it."
              : "Upgrade to set dates and stay on top of employer follow-ups."}
          </PremiumNotice>
        )}

        {/* Recruiter information */}
        <div className="border-t pt-6">
          <h4 className="mb-4 text-sm font-bold text-[#35483b]">
            Recruiter Information
          </h4>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                className={labelClasses}
                htmlFor="edit-recruiterName"
              >
                Recruiter Name
              </label>
              <input
                id="edit-recruiterName"
                type="text"
                name="recruiterName"
                value={formData.recruiterName}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                className={labelClasses}
                htmlFor="edit-recruiterEmail"
              >
                Recruiter Email
              </label>
              <input
                id="edit-recruiterEmail"
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
          <label className={labelClasses} htmlFor="edit-notes">
            Notes
          </label>
          <textarea
            id="edit-notes"
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
            className="rounded-xl border border-[#dfe6dd] px-5 py-3 text-sm font-semibold text-[#52665a] transition hover:bg-[#f6f8f4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#285a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e4935] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditApplicationForm;
