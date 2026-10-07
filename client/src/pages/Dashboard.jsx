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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Job Application Tracker
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of your job search
            </p>
          </div>

<div className="flex items-center gap-3">
  <span className="text-sm text-gray-600">
    {user?.name}
  </span>

  <button
    onClick={() => navigate("/settings")}
    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
  >
    Settings
  </button>

  <button
    onClick={handleLogout}
    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
  >
    Log out
  </button>
</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="mt-1 text-gray-500">
            Overview of your job applications.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalApplications}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Interviews
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {interviews}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Offers
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {offers}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Rejections
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejections}
            </p>
          </div>
        </section>

        {/* Add application */}
          <div className="mb-8 flex justify-end">
            <button
            onClick={() => setShowAddForm(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
    + Add Application
  </button>
</div>

        {/* Applications */}
        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Applications
            </h2>
          </div>

          {/* Filters */}
          <div className="grid gap-4 border-b bg-gray-50 px-6 py-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>

          {/* Application list */}
          <div className="divide-y">
            {applications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">
                  You don't have any applications yet.
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">
                  No applications match your search or filter.
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="p-6"
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
  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {application.jobTitle}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
            application.status
          )}`}
        >
          {application.status}
        </span>
      </div>

      <p className="mt-1 font-medium text-gray-700">
        {application.company}
      </p>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span>
          📍 {application.location || "Location not specified"}
        </span>

        <span>
          📅{" "}
          {new Date(
            application.applicationDate
          ).toLocaleDateString()}
        </span>
      </div>
    </div>

    <div className="flex gap-2">
      {application.jobUrl && (
        <a
          href={application.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View Job
        </a>
      )}

      <button
        onClick={() => setEditingId(application._id)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(application._id)}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>

  {(application.recruiterName ||
    application.recruiterEmail ||
    application.notes) && (
    <div className="grid gap-4 border-t pt-4 md:grid-cols-2">
      {(application.recruiterName ||
        application.recruiterEmail) && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Recruiter
          </p>

          {application.recruiterName && (
            <p className="text-sm text-gray-700">
              {application.recruiterName}
            </p>
          )}

          {application.recruiterEmail && (
            <a
              href={`mailto:${application.recruiterEmail}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {application.recruiterEmail}
            </a>
          )}
        </div>
      )}

      {application.notes && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Notes
          </p>

          <p className="whitespace-pre-wrap text-sm text-gray-600">
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
      {showAddForm && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setShowAddForm(false)}
  >
    <div
      className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Add Application
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a new job application to your tracker.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(false)}
          className="rounded-lg px-3 py-2 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
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
)}{showAddForm && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setShowAddForm(false)}
  >
    <div
      className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Add Application
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a new job application to your tracker.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(false)}
          className="rounded-lg px-3 py-2 text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
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