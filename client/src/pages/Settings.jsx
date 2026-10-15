import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";

function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, updateUser } = useAuth();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [billingMessage, setBillingMessage] = useState(() =>
    ({
      cancelled: "Checkout was cancelled. No payment was made.",
      success:
        "Payment received. We’re confirming your subscription with Stripe...",
    })[searchParams.get("checkout")] || ""
  );
  const [billingAction, setBillingAction] = useState("");
  const canManageBilling =
    user?.plan === "premium" ||
    ["past_due", "unpaid", "incomplete"].includes(
      user?.subscriptionStatus
    );

  useEffect(() => {
    const checkoutResult = searchParams.get("checkout");
    const billingReturn = searchParams.get("billing") === "return";

    if (!checkoutResult && !billingReturn) {
      return;
    }

    if (billingReturn && !checkoutResult) {
      let isMounted = true;

      apiRequest("/api/auth/me")
        .then((data) => {
          if (isMounted) {
            updateUser(data.user);
          }
        })
        .catch((refreshError) => {
          if (isMounted) {
            setBillingError(refreshError.message);
          }
        })
        .finally(() => {
          if (isMounted) {
            setSearchParams({}, { replace: true });
          }
        });

      return () => {
        isMounted = false;
      };
    }

    if (checkoutResult === "cancelled") {
      setSearchParams({}, { replace: true });
      return;
    }

    if (checkoutResult !== "success") {
      return;
    }

    let isMounted = true;

    const refreshSubscription = async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
          const data = await apiRequest("/api/auth/me");

          if (!isMounted) {
            return;
          }

          updateUser(data.user);

          if (data.user.plan === "premium") {
            setBillingMessage("Premium is active. Thanks for subscribing!");
            setSearchParams({}, { replace: true });
            return;
          }
        } catch (refreshError) {
          if (isMounted) {
            setBillingError(refreshError.message);
            setSearchParams({}, { replace: true });
          }
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (isMounted) {
        setBillingMessage(
          "Your payment is being processed. Refresh this page in a moment to see your updated plan."
        );
        setSearchParams({}, { replace: true });
      }
    };

    refreshSubscription();

    return () => {
      isMounted = false;
    };
  }, [searchParams, setSearchParams, updateUser]);

  const handleBillingAction = async (action) => {
    setBillingError("");
    setBillingAction(action);

    try {
      const endpoint =
        action === "portal"
          ? "/api/billing/portal-session"
          : "/api/billing/checkout-session";
      const session = await apiRequest(endpoint, { method: "POST" });

      if (!session.url) {
        throw new Error("Stripe did not return a billing session URL.");
      }

      window.location.assign(session.url);
    } catch (billingRequestError) {
      setBillingError(billingRequestError.message);
      setBillingAction("");
    }
  };

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
  <div className="min-h-screen bg-[#f6f7f3]">
    {/* Header */}
    <header className="border-b border-white/10 bg-[#15392f] text-white shadow-lg shadow-emerald-950/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4ed9d] text-[#15392f]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
              <path d="M4 8.5h16v11H4zM9 8.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5M4 12h16M10 12v2h4v-2" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Job Tracker</h1>
            <p className="mt-0.5 text-xs text-emerald-100/70">Account settings</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-emerald-50 transition hover:border-white/30 hover:bg-white/10 sm:px-4"
        >
          ← Back to Dashboard
        </button>
      </div>
    </header>

    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Page heading */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#588263]">
          Your account
        </p>

        <h2 className="text-4xl font-bold tracking-tight text-[#20392e]">
          Settings
        </h2>

        <p className="mt-2 max-w-2xl text-[#7b8a7f]">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Account Information */}
      <section className="mb-6 rounded-[1.5rem] border border-[#e5e9e1] bg-white p-6 shadow-[0_4px_18px_rgba(26,51,39,0.035)] sm:p-8">
        <div className="flex items-start gap-4">

          <div>
            <h3 className="text-lg font-bold text-[#20392e]">
              Account Information
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[#edf0eb] pt-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#f7f9f5] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#87958b]">
              Name
            </p>

            <p className="mt-2 font-semibold text-[#35483b]">
              {user?.name}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f7f9f5] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#87958b]">
              Email
            </p>

            <p className="mt-2 break-words font-semibold text-[#35483b]">
              {user?.email}
            </p>
          </div>
        </div>
      </section>

      <section
        id="plan"
        className="mb-6 rounded-[1.5rem] border border-[#e5e9e1] bg-white p-6 shadow-[0_4px_18px_rgba(26,51,39,0.035)] sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#87958b]">
              Your subscription
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#20392e]">
              {user?.plan === "premium" ? "Premium plan" : "Free plan"}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#68796e]">
              {user?.plan === "premium"
                ? user.cancelAtPeriodEnd && user.currentPeriodEnd
                  ? `You have Premium access until ${new Date(
                      user.currentPeriodEnd
                    ).toLocaleDateString()}.`
                  : "You have access to follow-up reminders."
                : "Follow-up reminders are a Premium feature. Existing reminders remain visible, but can’t be changed on the Free plan."}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              user?.plan === "premium"
                ? "border border-[#cde2d6] bg-[#eaf5ef] text-[#326b4b]"
                : "border border-[#e2e7df] bg-[#f3f5f1] text-[#65736a]"
            }`}
          >
            {user?.plan === "premium" ? "ACTIVE" : "CURRENT PLAN"}
          </span>
        </div>
        {billingMessage && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-[#dce8d9] bg-[#f5f8f2] px-4 py-3 text-sm text-[#42684b]"
          >
            {billingMessage}
          </div>
        )}
        {billingError && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {billingError}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#edf0eb] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#35483b]">
              Premium · $5 USD / month
            </p>
            <p className="mt-1 text-sm text-[#81734f]">
              Secure billing powered by Stripe. Cancel any time.
            </p>
          </div>
          {canManageBilling ? (
            <button
              onClick={() => handleBillingAction("portal")}
              disabled={Boolean(billingAction)}
              className="rounded-xl border border-[#d7e4d4] bg-[#f2f7ef] px-5 py-3 text-sm font-semibold text-[#42684b] transition hover:bg-[#eaf2e6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {billingAction === "portal"
                ? "Opening billing..."
                : "Manage subscription"}
            </button>
          ) : (
            <button
              onClick={() => handleBillingAction("checkout")}
              disabled={Boolean(billingAction)}
              className="rounded-xl bg-[#285a43] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e4935] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {billingAction === "checkout"
                ? "Opening secure checkout..."
                : "Upgrade to Premium"}
            </button>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-[1.5rem] border border-[#f0dedb] bg-white p-6 shadow-[0_4px_18px_rgba(26,51,39,0.035)] sm:p-8">
        <div className="flex items-start gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#a35e53]">
              Danger Zone
            </h3>

            <p className="mt-1 text-sm text-[#7b8a7f]">
              Actions here can permanently affect your account.
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#f3e8e6] pt-6">
          <p className="text-sm leading-6 text-[#68796e]">
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
              className="rounded-xl bg-[#a35e53] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f4d43] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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