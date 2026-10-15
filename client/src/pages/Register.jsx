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
    "w-full rounded-xl border border-[#dfe6dd] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition placeholder:text-[#9aa69c] focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]";

return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7f3] px-4 py-10">
    {/* Background decoration */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#d4e6ce]/65 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#d9e7dd]/70 blur-3xl" />
    </div>

    <div className="relative w-full max-w-md">
      {/* Branding */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#15392f] text-[#d4ed9d] shadow-lg shadow-[#15392f]/15">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
            <path d="M4 8.5h16v11H4zM9 8.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5M4 12h16M10 12v2h4v-2" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#18372d]">
          Job Tracker
        </h1>
        <p className="mt-2 text-sm text-[#718176]">
          Your job search, thoughtfully organized.
        </p>
      </div>

      {/* Registration card */}
      <div className="rounded-[1.75rem] border border-[#e5e9e1] bg-white p-7 shadow-[0_24px_70px_rgba(29,53,39,0.09)] sm:p-9">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#588263]">
            Get started
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#20392e]">
            Create your account
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#7b8a7f]">
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
            <label className="mb-2 block text-sm font-semibold text-[#52665a]">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#52665a]">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#52665a]">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              minLength={6}
              className={inputClasses}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#285a43] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#285a43]/15 transition hover:bg-[#1e4935] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e7ebe4]" />

          <span className="text-xs font-semibold tracking-widest text-[#a0aaa2]">
            OR
          </span>

          <div className="h-px flex-1 bg-[#e7ebe4]" />
        </div>

        <p className="text-center text-sm text-[#7b8a7f]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#3f7652] transition hover:text-[#285a43] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-[#96a198]">
        Made for the next step in your career.
      </p>
    </div>
  </div>
);
}

export default Register;