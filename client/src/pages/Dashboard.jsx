import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../api/api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import FollowUpSection from "../components/dashboard/FollowUpSection";
import ApplicationsSection from "../components/dashboard/ApplicationsSection";
import AddApplicationModal from "../components/dashboard/AddApplicationModal";
import {
  formatFollowUpDate,
  getFollowUpDateString,
  getLocalDateString,
} from "../components/dashboard/dashboardDates";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const canUseFollowUps = user?.plan === "premium";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [rescheduleDates, setRescheduleDates] = useState({});
  const [savingFollowUpId, setSavingFollowUpId] = useState(null);

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
    setShowAddForm(false);
  };

  const handleApplicationUpdated = (updatedApplication) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application._id === updatedApplication._id
          ? updatedApplication
          : application
      )
    );
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
        currentApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const todayString = getLocalDateString();
  const pendingFollowUps = applications
    .filter(
      (application) =>
        application.followUpDate && !application.followUpCompleted
    )
    .sort((a, b) =>
      getFollowUpDateString(a.followUpDate).localeCompare(
        getFollowUpDateString(b.followUpDate)
      )
    );
  const overdueFollowUps = pendingFollowUps.filter(
    (application) =>
      getFollowUpDateString(application.followUpDate) < todayString
  );
  const todayFollowUps = pendingFollowUps.filter(
    (application) =>
      getFollowUpDateString(application.followUpDate) === todayString
  );

  const handleMarkFollowUpCompleted = async (application) => {
    setError("");
    setSavingFollowUpId(application._id);

    try {
      const updatedApplication = await apiRequest(
        `/api/applications/${application._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            followUpCompleted: true,
          }),
        }
      );

      handleApplicationUpdated(updatedApplication);
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingFollowUpId(null);
    }
  };

  const handleRescheduleFollowUp = async (application) => {
    const followUpDate = rescheduleDates[application._id];

    if (!followUpDate) {
      setError("Choose a follow-up date before saving.");
      return;
    }

    setError("");
    setSavingFollowUpId(application._id);

    try {
      const updatedApplication = await apiRequest(
        `/api/applications/${application._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            followUpDate,
            followUpCompleted: false,
          }),
        }
      );

      handleApplicationUpdated(updatedApplication);

      setRescheduleDates((currentDates) => {
        const nextDates = { ...currentDates };
        delete nextDates[application._id];
        return nextDates;
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingFollowUpId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f3]">
      <DashboardHeader
        user={user}
        onSettings={() => navigate("/settings")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#e8efe6] px-6 py-8 sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border-[36px] border-white/40" />
          <div className="pointer-events-none absolute -bottom-36 right-44 h-64 w-64 rounded-full bg-[#d7e5d3]/70 blur-2xl" />
          <div className="relative max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#cdddc9] bg-white/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#38624e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6e9c61]" />
              Your job search
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#18372d] sm:text-4xl">
              Make your next move.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5d7164] sm:text-base">
              A calmer way to keep every application, conversation, and
              follow-up moving forward.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              onClick={() => setError("")}
              className="font-semibold hover:text-red-900"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <DashboardStats applications={applications} />

        <FollowUpSection
          pendingFollowUps={pendingFollowUps}
          overdueFollowUps={overdueFollowUps}
          todayFollowUps={todayFollowUps}
          todayString={todayString}
          rescheduleDates={rescheduleDates}
          savingFollowUpId={savingFollowUpId}
          formatFollowUpDate={formatFollowUpDate}
          canUseFollowUps={canUseFollowUps}
          onRescheduleDateChange={(id, date) =>
            setRescheduleDates((currentDates) => ({
              ...currentDates,
              [id]: date,
            }))
          }
          onReschedule={handleRescheduleFollowUp}
          onMarkCompleted={handleMarkFollowUpCompleted}
        />

        <ApplicationsSection
          applications={applications}
          onApplicationUpdated={handleApplicationUpdated}
          onDelete={handleDelete}
          formatFollowUpDate={formatFollowUpDate}
          canUseFollowUps={canUseFollowUps}
          onAddApplication={() => setShowAddForm(true)}
        />
      </main>

      {showAddForm && (
        <AddApplicationModal
          onClose={() => setShowAddForm(false)}
          onApplicationCreated={handleApplicationCreated}
          canUseFollowUps={canUseFollowUps}
        />
      )}
    </div>
  );
}

export default Dashboard;
