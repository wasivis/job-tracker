import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This will permanently delete your account and all of your job applications."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      await apiRequest("/api/auth/account", {
        method: "DELETE",
      });

      logout();
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setDeleting(false);
    }
  };

return (
  <div className="min-h-screen bg-slate-100">
    {/* Header */}
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Job Application Tracker
          </h1>

          <p className="mt-0.5 text-sm text-slate-500">
            Account settings
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          ← Back to Dashboard
        </button>
      </div>
    </header>

    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Page heading */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Your account
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
          Settings
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Account Information */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Account Information
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Name
            </p>

            <p className="mt-2 font-medium text-slate-800">
              {user?.name}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <p className="mt-2 break-words font-medium text-slate-800">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div>
            <h3 className="text-lg font-bold text-rose-700">
              Danger Zone
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Actions here can permanently affect your account.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-rose-100 pt-6">
          <p className="text-sm leading-6 text-slate-600">
            Permanently delete your account and all of your job
            applications. This action cannot be undone.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting Account..." : "Delete Account"}
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
);
}

export default Settings;