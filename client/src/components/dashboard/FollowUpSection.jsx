import { getFollowUpStatus, getFollowUpDateString } from "./dashboardDates";
import PremiumNotice from "./PremiumNotice";

function FollowUpSection({
  pendingFollowUps,
  overdueFollowUps,
  todayFollowUps,
  todayString,
  rescheduleDates,
  savingFollowUpId,
  formatFollowUpDate,
  canUseFollowUps,
  onRescheduleDateChange,
  onReschedule,
  onMarkCompleted,
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-[1.5rem] border border-[#e5e9e1] bg-white shadow-[0_4px_18px_rgba(26,51,39,0.035)]">
      <div className="flex flex-col gap-4 border-b border-[#edf0eb] bg-[#fbfcfa] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8efe6] text-[#477153]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path d="M7 3v3m10-3v3M4.5 9h15M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#20392e]">Follow-ups</h2>
              <p className="mt-0.5 text-xs text-[#7c8c80] sm:text-sm">
            Keep track of when to contact employers and recruiters.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-[#f0d9d5] bg-[#fff5f2] px-3 py-1.5 text-[#a35e53]">
            {overdueFollowUps.length} overdue
          </span>
          <span className="rounded-full border border-[#f0e2c6] bg-[#fff9eb] px-3 py-1.5 text-[#9b7134]">
            {todayFollowUps.length} due today
          </span>
          <span className="rounded-full border border-[#e6eae4] bg-[#f5f7f3] px-3 py-1.5 text-[#637568]">
            {pendingFollowUps.length} pending
          </span>
        </div>
      </div>

      {!canUseFollowUps && (
        <div className="border-b border-[#edf0eb] px-5 py-4 sm:px-7">
          <PremiumNotice compact>
            {pendingFollowUps.length
              ? "Existing reminders remain visible. Upgrade to reschedule or mark them complete."
              : "Upgrade to create reminders and know when it’s time to follow up."}
          </PremiumNotice>
        </div>
      )}

      {pendingFollowUps.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3e9] text-xl text-[#53765a]">
            ✓
          </div>
          <p className="font-semibold text-[#35483b]">No pending follow-ups</p>
          <p className="mt-1 text-sm text-[#87958b]">
            {canUseFollowUps
              ? "Add a follow-up date when creating or editing an application."
              : "Your follow-up list is ready when you upgrade."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#edf0eb]">
          {pendingFollowUps.map((application) => {
            const followUpStatus = getFollowUpStatus(
              application,
              todayString
            );
            const isSaving = savingFollowUpId === application._id;
            const originalDate = getFollowUpDateString(
              application.followUpDate
            );
            const selectedDate =
              rescheduleDates[application._id] ?? originalDate;
            const dateHasChanged = selectedDate !== originalDate;

            return (
              <div
                key={application._id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fbfcfa] sm:px-7 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#273b30]">
                      {application.company}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${followUpStatus.classes}`}
                    >
                      {followUpStatus.label}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#68796e]">
                    {application.jobTitle}
                  </p>

                  <p className="mt-2 text-sm text-[#849087]">
                    Current follow-up date:{" "}
                    <span className="font-medium text-slate-700">
                      {formatFollowUpDate(application.followUpDate)}
                    </span>
                  </p>
                </div>

                {canUseFollowUps ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <label
                        htmlFor={`follow-up-date-${application._id}`}
                        className="text-xs font-semibold text-[#637568]"
                      >
                        Choose a new date
                      </label>
                      <input
                        id={`follow-up-date-${application._id}`}
                        type="date"
                        min={todayString}
                        value={selectedDate}
                        onChange={(event) =>
                          onRescheduleDateChange(
                            application._id,
                            event.target.value
                          )
                        }
                        disabled={isSaving}
                        className="min-w-0 rounded-lg border border-[#dfe6dd] bg-white px-3 py-2 text-sm text-[#34483b] outline-none transition focus:border-[#6f9a77] focus:ring-2 focus:ring-[#e6f0e4]"
                      />
                      {!dateHasChanged && (
                        <p className="text-xs text-[#98a39a]">
                          Select a different date to reschedule.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onReschedule(application)}
                      disabled={isSaving || !dateHasChanged || !selectedDate}
                      className="rounded-lg border border-[#d7e4d4] bg-[#f2f7ef] px-4 py-2 text-sm font-semibold text-[#42684b] transition hover:border-[#b9d0b7] hover:bg-[#eaf2e6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save new date"}
                    </button>

                    <button
                      onClick={() => onMarkCompleted(application)}
                      disabled={isSaving}
                      className="rounded-lg bg-[#285a43] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1e4935] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Mark completed"}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-[#87958b]">
                    Reminder details are read-only on the Free plan.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FollowUpSection;
