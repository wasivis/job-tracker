import ApplicationForm from "../ApplicationForm";

function AddApplicationModal({
  onClose,
  onApplicationCreated,
  canUseFollowUps,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#11251d]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-[#e5e9e1] bg-white p-6 shadow-[0_24px_80px_rgba(12,32,22,0.24)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#588263]">
              New opportunity
            </p>
            <h2 className="text-xl font-bold tracking-tight text-[#20392e]">
              Add Application
            </h2>
            <p className="mt-1 text-sm text-[#7b8a7f]">
              Add a new job application to your tracker.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-2xl leading-none text-[#87958b] transition hover:bg-[#f1f4ef] hover:text-[#52665a]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <ApplicationForm
          onApplicationCreated={onApplicationCreated}
          canUseFollowUps={canUseFollowUps}
        />
      </div>
    </div>
  );
}

export default AddApplicationModal;
