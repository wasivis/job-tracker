import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import ApplicationForm from "../components/ApplicationForm";
import EditApplicationForm from "../components/EditApplicationForm";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await apiRequest("/api/applications");
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApplicationCreated = (newApplication) => {
    setApplications((currentApplications) => [
      newApplication,
      ...currentApplications,
    ]);
  };

  const handleApplicationUpdated = (updatedApplication) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application._id === updatedApplication._id
          ? updatedApplication
          : application
      )
    );

    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/api/applications/${id}`, {
        method: "DELETE",
      });

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application._id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const rejections = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const filteredApplications = applications
    .filter((application) => {
      const search = searchTerm.toLowerCase();

      return (
        application.company.toLowerCase().includes(search) ||
        application.jobTitle.toLowerCase().includes(search) ||
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
          new Date(b.applicationDate) -
          new Date(a.applicationDate)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.applicationDate) -
          new Date(b.applicationDate)
        );
      }

      if (sortBy === "company") {
        return a.company.localeCompare(b.company);
      }

      return 0;
    });

  const getStatusClasses = (status) => {
    const classes = {
      Saved: "bg-gray-100 text-gray-700",
      Applied: "bg-blue-100 text-blue-700",
      Assessment: "bg-purple-100 text-purple-700",
      Interview: "bg-yellow-100 text-yellow-700",
      Offer: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
      Hired: "bg-emerald-100 text-emerald-700",
    };

    return classes[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-100">
    {/* Header */}
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Job Application Tracker
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Keep your job search organized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500">
              Job seeker
            </p>
          </div>

          <button
            onClick={() => navigate("/settings")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Page heading */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Your job search
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Keep track of your applications, follow your progress,
          and stay on top of every opportunity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Applications
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {totalApplications}
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            All applications in your tracker
          </p>
        </div>

        {/* Interviews */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Interviews
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight text-amber-600">
                {interviews}
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Applications reaching the interview stage
          </p>
        </div>

        {/* Offers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Offers
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight text-emerald-600">
                {offers}
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Offers received
          </p>
        </div>

        {/* Rejections */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Rejections
              </p>

              <p className="mt-3 text-4xl font-bold tracking-tight text-rose-600">
                {rejections}
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Applications that didn't work out
          </p>
        </div>
      </section>

      {/* Applications heading + Add button */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage your opportunities.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
        >
          + Add Application
        </button>
      </div>

      {/* Applications */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Application list */}
        <div className="divide-y divide-slate-100">
          {applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📋
              </div>

              <p className="font-medium text-slate-700">
                You don't have any applications yet.
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add your first application to get started.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🔎
              </div>

              <p className="font-medium text-slate-700">
                No applications found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application._id}
                className="p-6 transition hover:bg-slate-50/60"
              >
                {editingId === application._id ? (
                  <EditApplicationForm
                    application={application}
                    onApplicationUpdated={
                      handleApplicationUpdated
                    }
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900">
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

                        <p className="mt-1 font-semibold text-slate-700">
                          {application.company}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          <span>
                            📍{" "}
                            {application.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            📅{" "}
                            {new Date(
                              application.applicationDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {application.jobUrl && (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            View Job
                          </a>
                        )}

                        <button
                          onClick={() =>
                            setEditingId(application._id)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(application._id)
                          }
                          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {(application.recruiterName ||
                      application.recruiterEmail ||
                      application.notes) && (
                      <div className="grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
                        {(application.recruiterName ||
                          application.recruiterEmail) && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Recruiter
                            </p>

                            {application.recruiterName && (
                              <p className="text-sm font-medium text-slate-700">
                                {application.recruiterName}
                              </p>
                            )}

                            {application.recruiterEmail && (
                              <a
                                href={`mailto:${application.recruiterEmail}`}
                                className="text-sm text-blue-600 transition hover:text-blue-700 hover:underline"
                              >
                                {application.recruiterEmail}
                              </a>
                            )}
                          </div>
                        )}

                        {application.notes && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Notes
                            </p>

                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>

    {/* Add Application Modal */}
    {showAddForm && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        onClick={() => setShowAddForm(false)}
      >
        <div
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                New opportunity
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                Add Application
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a new job application to your tracker.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-xl px-3 py-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <ApplicationForm
            onApplicationCreated={(newApplication) => {
              handleApplicationCreated(newApplication);
              setShowAddForm(false);
            }}
          />
        </div>
      </div>
    )}
  </div>
);
}

export default Dashboard;