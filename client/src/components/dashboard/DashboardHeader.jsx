function DashboardHeader({ user, onSettings, onLogout }) {
  return (
    <header className="border-b border-white/10 bg-[#15392f] text-white shadow-lg shadow-emerald-950/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d4ed9d] text-[#15392f] shadow-inner shadow-white/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M4 8.5h16v11H4zM9 8.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2.5M4 12h16M10 12v2h4v-2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">
              Job Tracker
            </h1>
            <p className="mt-0.5 hidden text-xs text-emerald-100/70 sm:block">
              Your job search, thoughtfully organized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden border-r border-white/15 pr-4 text-right sm:block">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="mt-0.5 text-xs text-emerald-100/60">Job seeker</p>
          </div>

          <button
            onClick={onSettings}
            className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-emerald-50 transition hover:border-white/30 hover:bg-white/10 sm:px-4"
          >
            Settings
          </button>

          <button
            onClick={onLogout}
            className="rounded-xl bg-[#d4ed9d] px-3.5 py-2 text-sm font-semibold text-[#15392f] shadow-sm transition hover:bg-[#e1f5b7] sm:px-4"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
