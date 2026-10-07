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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Job Application Tracker
            </h1>

            <p className="text-sm text-gray-500">
              Account settings
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Settings
          </h2>

          <p className="mt-1 text-gray-500">
            Manage your account.
          </p>
        </div>

        <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Account Information
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Name
              </p>

              <p className="mt-1 text-gray-900">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Email
              </p>

              <p className="mt-1 text-gray-900">
                {user?.email}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-red-700">
            Danger Zone
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Permanently delete your account and all of your job
            applications. This action cannot be undone.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting Account..." : "Delete Account"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;