import { useState } from "react";

import { apiRequest } from "../../api/api";

const emptyRound = {
  roundName: "",
  interviewDate: "",
  interviewer: "",
  notes: "",
  outcome: "Scheduled",
};

const outcomes = [
  "Scheduled",
  "Awaiting feedback",
  "Passed",
  "Not selected",
  "Completed",
  "Cancelled",
];

const dateForInput = (date) => (date ? String(date).slice(0, 10) : "");

const formatInterviewDate = (date) => {
  const dateString = dateForInput(date);
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function InterviewRounds({ application, onApplicationUpdated }) {
  const interviews = application.interviews || [];
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRoundId, setEditingRoundId] = useState(null);
  const [formData, setFormData] = useState(emptyRound);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const startAdding = () => {
    setError("");
    setEditingRoundId(null);
    setFormData(emptyRound);
    setEditorOpen(true);
  };

  const startEditing = (round) => {
    setError("");
    setEditingRoundId(round._id);
    setFormData({
      roundName: round.roundName || "",
      interviewDate: dateForInput(round.interviewDate),
      interviewer: round.interviewer || "",
      notes: round.notes || "",
      outcome: round.outcome || "Scheduled",
    });
    setEditorOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const round = {
      ...formData,
      roundName: formData.roundName.trim(),
      interviewer: formData.interviewer.trim(),
      notes: formData.notes.trim(),
    };
    const updatedInterviews = editingRoundId
      ? interviews.map((existingRound) =>
          existingRound._id === editingRoundId
            ? { ...round, _id: editingRoundId }
            : existingRound
        )
      : [...interviews, round];

    try {
      const updatedApplication = await apiRequest(
        `/api/applications/${application._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ interviews: updatedInterviews }),
        }
      );

      onApplicationUpdated(updatedApplication);
      setEditorOpen(false);
      setEditingRoundId(null);
      setFormData(emptyRound);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roundId) => {
    if (!window.confirm("Delete this interview round?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      const updatedApplication = await apiRequest(
        `/api/applications/${application._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            interviews: interviews.filter((round) => round._id !== roundId),
          }),
        }
      );

      onApplicationUpdated(updatedApplication);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-[#dfe6dd] bg-white px-4 py-3 text-sm text-[#34483b] outline-none transition focus:border-[#6f9a77] focus:ring-4 focus:ring-[#eaf2e8]";

  return (
    <section className="border-t border-[#edf0eb] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[#35483b]">
            Interview rounds
          </h4>
          <p className="mt-1 text-xs text-[#87958b]">
            {interviews.length
              ? `${interviews.length} round${interviews.length === 1 ? "" : "s"}`
              : "Keep dates, interviewer details, notes, and outcomes together."}
          </p>
        </div>

        {!editorOpen && (
          <button
            type="button"
            onClick={startAdding}
            disabled={saving}
            className="rounded-xl border border-[#d7e4d4] bg-[#f2f7ef] px-3.5 py-2 text-sm font-semibold text-[#42684b] transition hover:bg-[#eaf2e6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add interview
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {interviews.length > 0 && (
        <ol className="mt-4 space-y-3">
          {[...interviews]
            .sort(
              (a, b) =>
                new Date(a.interviewDate) - new Date(b.interviewDate)
            )
            .map((round) => (
              <li
                key={round._id}
                className="rounded-2xl border border-[#e6ebe3] bg-[#fafbf9] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-semibold text-[#35483b]">
                        {round.roundName || "Interview"}
                      </h5>
                      <span className="rounded-full border border-[#d7e5df] bg-[#eef5f0] px-2.5 py-1 text-xs font-semibold text-[#426a54]">
                        {round.outcome}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#718176]">
                      {formatInterviewDate(round.interviewDate)}
                      {round.interviewer ? ` · ${round.interviewer}` : ""}
                    </p>
                    {round.notes && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#718176]">
                        {round.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(round)}
                      disabled={saving}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(round._id)}
                      disabled={saving}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ol>
      )}

      {editorOpen && (
        <form
          onSubmit={handleSave}
          className="mt-4 rounded-2xl border border-[#dce8d9] bg-[#f5f8f2] p-4"
        >
          <h5 className="mb-4 font-bold text-[#35483b]">
            {editingRoundId ? "Edit interview round" : "Add interview round"}
          </h5>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`interview-name-${application._id}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Round name
              </label>
              <input
                id={`interview-name-${application._id}`}
                name="roundName"
                value={formData.roundName}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Hiring manager"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor={`interview-date-${application._id}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Date *
              </label>
              <input
                id={`interview-date-${application._id}`}
                name="interviewDate"
                type="date"
                value={formData.interviewDate}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor={`interview-interviewer-${application._id}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Interviewer
              </label>
              <input
                id={`interview-interviewer-${application._id}`}
                name="interviewer"
                value={formData.interviewer}
                onChange={handleChange}
                maxLength={100}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor={`interview-outcome-${application._id}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Outcome
              </label>
              <select
                id={`interview-outcome-${application._id}`}
                name="outcome"
                value={formData.outcome}
                onChange={handleChange}
                className={inputClasses}
              >
                {outcomes.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`interview-notes-${application._id}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                Notes
              </label>
              <textarea
                id={`interview-notes-${application._id}`}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                maxLength={2000}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              disabled={saving}
              className="rounded-xl border border-[#dfe6dd] bg-white px-4 py-2.5 text-sm font-semibold text-[#52665a] hover:bg-[#f6f8f4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#285a43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4935] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save interview"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default InterviewRounds;
