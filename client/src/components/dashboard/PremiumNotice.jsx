import { Link } from "react-router-dom";

function PremiumNotice({ children, compact = false }) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-[#eadfbe] bg-[#fffaf0] ${
        compact ? "items-center p-3" : "items-start p-4"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f3e9ca] text-[#896c32]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#5a4b2a]">
          Follow-up reminders are a Premium feature
        </p>
        {children && (
          <p className="mt-1 text-xs leading-5 text-[#81734f]">{children}</p>
        )}
        <Link
          to="/settings#plan"
          className="mt-2 inline-flex text-xs font-bold text-[#765d27] underline decoration-[#c8b578] underline-offset-4 transition hover:text-[#4f3e19]"
        >
          View plan options
        </Link>
      </div>
    </div>
  );
}

export default PremiumNotice;
