import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">
    {/* Background decoration */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
    </div>

    <div className="relative w-full max-w-md">
      {/* Branding */}
      <div className="mb-8 text-center">

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Job Application Tracker
        </h1>

        <p className="mt-2 text-slate-500">
          Keep your job search organized.
        </p>
      </div>

      {/* Registration card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Get started
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start organizing your applications and keep your job search moving forward.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`${inputClasses} rounded-xl border-slate-200 px-4 py-3 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`${inputClasses} rounded-xl border-slate-200 px-4 py-3 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              minLength={6}
              className={`${inputClasses} rounded-xl border-slate-200 px-4 py-3 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Your applications, organized in one place.
      </p>
    </div>
  </div>
);
}

export default Register;