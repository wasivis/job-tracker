import { useState } from "react";

import EditApplicationForm from "../EditApplicationForm";
import InterviewRounds from "./InterviewRounds";

const getStatusClasses = (status) => {
  const classes = {
    Saved: "border border-[#e2e7df] bg-[#f3f5f1] text-[#65736a]",
    Applied: "border border-[#d7e5df] bg-[#eef5f0] text-[#426a54]",
    Assessment: "border border-[#e0dcef] bg-[#f4f1fa] text-[#716091]",
    Interview: "border border-[#f0e2c6] bg-[#fff8e9] text-[#9a7139]",
    Offer: "border border-[#d0e5d5] bg-[#edf7ef] text-[#41754f]",
    Rejected: "border border-[#f0d9d5] bg-[#fff3f1] text-[#a45e54]",
    Hired: "border border-[#cde2d6] bg-[#eaf5ef] text-[#326b4b]",
  };

  return classes[status] || "border border-[#e2e7df] bg-[#f3f5f1] text-[#65736a]";
};

function ApplicationsSection({
  applications,
  onApplicationUpdated,
  onDelete,
  formatFollowUpDate,
  onAddApplication,
  canUseFollowUps,
}) {
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredApplications = applications
    .filter((application) => {
      const search = searchTerm.toLowerCase();

      return (
        (application.company || "").toLowerCase().includes(search) ||
        (application.jobTitle || "").toLowerCase().includes(search) ||
        (application.location || "").toLowerCase().includes(search)
      );
    })
    .filter((application) => {
      if (statusFilter === "All") {
        return true;
      }

      return application.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.applicationDate) - new Date(a.applicationDate)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.applicationDate) - new Date(b.applicationDate)
        );
      }

      if (sortBy === "company") {
        return (a.company || "").localeCompare(b.company || "");
      }

      return 0;
    });

  const handleApplicationUpdated = (updatedApplication) => {
    onApplicationUpdated(updatedApplication);
    setEditingId(null);
  };

  return (
    <>
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#77917c]">
            The pipeline
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#20392e]">Applications</h2>
          <p className="mt-1 text-sm text-[#7b8a7f]">
            Track and manage your opportunities.
          </p>
        </div>

        <button
          onClick={onAddApplication}
          className="inline-flex items-center gap-2 rounded-xl bg-[#285a43] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#285a43]/15 transition hover:-translate-y-0.5 hover:bg-[#1e4935] hover:shadow-lg"
        >
          <span className="text-lg leading-none">+</span>
          Add application
        </button>
      </div>

      <section className="overflow-hidden rounded-[1.5rem] border border-[#e5e9e1] bg-white shadow-[0_4px_18px_rgba(26,51,39,0.035)]">
        <div className="border-b border-[#edf0eb] bg-[#fbfcfa] p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              aria-label="Search applications"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-xl border border-[#e1e7df] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition placeholder:text-[#9aa69c] focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]"
            />

            <select
              aria-label="Filter by application status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#e1e7df] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]"
            >
              <option value="All">All Statuses</option>
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>

            <select
              aria-label="Sort applications"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-[#e1e7df] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 bg-[#fafbf9] p-3 sm:space-y-4 sm:p-5">
          {applications.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-2xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7 text-[#58785c]" aria-hidden="true">
                  <path d="M8 4h8l2 2v14H6V4h2Zm0 0v4h8V4M9 13h6m-6 3h6" />
                </svg>
              </div>
              <p className="font-semibold text-[#35483b]">
                You don't have any applications yet.
              </p>
              <p className="mt-1 text-sm text-[#87958b]">
                Add your first application to get started.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-2xl text-[#58785c]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-7 w-7" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4 4" />
                </svg>
              </div>
              <p className="font-semibold text-[#35483b]">No applications found</p>
              <p className="mt-1 text-sm text-[#87958b]">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-[#e8ece5] bg-white p-5 shadow-[0_2px_8px_rgba(26,51,39,0.025)] transition duration-200 hover:border-[#d4dfd2] hover:shadow-[0_8px_22px_rgba(26,51,39,0.055)] sm:p-6"
              >
                {editingId === application._id ? (
                  <EditApplicationForm
                    application={application}
                    onApplicationUpdated={handleApplicationUpdated}
                    onCancel={() => setEditingId(null)}
                    canUseFollowUps={canUseFollowUps}
                  />
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold tracking-tight text-[#20392e]">
                            {application.jobTitle}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <p className="mt-1 font-semibold text-[#52665a]">
                          {application.company}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#7d8b81]">
                          <span>
                            📍 {application.location || "Location not specified"}
                          </span>
                          <span>
                            📅{" "}
                            {application.applicationDate
                              ? new Date(
                                  application.applicationDate
                                ).toLocaleDateString()
                              : "Date not specified"}
                          </span>
                          {application.followUpDate &&
                            !application.followUpCompleted && (
                              <span>
                                🔔 Follow-up:{" "}
                                {formatFollowUpDate(application.followUpDate)}
                              </span>
                            )}
                          {application.followUpCompleted && (
                            <span className="font-medium text-emerald-700">
                              ✓ Follow-up completed:{" "}
                              {formatFollowUpDate(application.followUpDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {application.jobUrl && (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-[#e1e7df] bg-white px-4 py-2 text-sm font-medium text-[#52665a] transition hover:border-[#cbd8c9] hover:bg-[#f8faf7]"
                          >
                            View Job
                          </a>
                        )}
                        <button
                          onClick={() => setEditingId(application._id)}
                          className="rounded-xl border border-[#e1e7df] bg-white px-4 py-2 text-sm font-medium text-[#52665a] transition hover:border-[#cbd8c9] hover:bg-[#f8faf7]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(application._id)}
                          className="rounded-xl border border-[#f0d9d5] bg-[#fff5f2] px-4 py-2 text-sm font-semibold text-[#a35e53] transition hover:bg-[#ffebe7]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {(application.recruiterName ||
                      application.recruiterEmail ||
                      application.notes) && (
                      <div className="grid gap-5 border-t border-[#edf0eb] pt-5 md:grid-cols-2">
                        {(application.recruiterName ||
                          application.recruiterEmail) && (
                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#97a39a]">
                              Recruiter
                            </p>
                            {application.recruiterName && (
                              <p className="text-sm font-medium text-[#52665a]">
                                {application.recruiterName}
                              </p>
                            )}
                            {application.recruiterEmail && (
                              <a
                                href={`mailto:${application.recruiterEmail}`}
                                className="text-sm text-[#3f7652] transition hover:text-[#285a43] hover:underline"
                              >
                                {application.recruiterEmail}
                              </a>
                            )}
                          </div>
                        )}
                        {application.notes && (
                          <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#97a39a]">
                              Notes
                            </p>
                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#68796e]">
                              {application.notes}
                            </p>
                          </div>
                        )}

                        <InterviewRounds
                          application={application}
                          onApplicationUpdated={handleApplicationUpdated}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default ApplicationsSection;
