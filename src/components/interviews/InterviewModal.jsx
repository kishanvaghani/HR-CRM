import { useState } from "react";

export default function InterviewModal({
  showModal,
  editingInterview,
  newInterview,
  setNewInterview,
  loading,
  onClose,
  onSubmit,
}) {
  const [formErrors, setFormErrors] = useState({});

  if (!showModal) return null;

  const validateForm = () => {
    const errors = {};

    if (!newInterview.candidate?.trim()) {
      errors.candidate = "Candidate name is required";
    }

    if (!newInterview.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newInterview.email)) {
      errors.email = "Email is invalid";
    }

    if (!newInterview.position?.trim()) {
      errors.position = "Position is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    console.log("Submitting interview data:", {
      ...newInterview,
      isEdit: !!editingInterview,
      editingId: editingInterview?._id,
    });

    onSubmit();
  };

  const handleInputChange = (field, value) => {
    setNewInterview((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-full md:max-w-2xl">
        <h3 className="font-bold text-lg mb-6">
          {editingInterview ? "Edit Interview" : "Schedule New Interview"}
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Candidate Name *
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter candidate name"
                className={`input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.candidate ? "input-error" : ""
                }`}
                value={newInterview.candidate}
                onChange={(e) => handleInputChange("candidate", e.target.value)}
              />
              {formErrors.candidate && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.candidate}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email *</span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className={`input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.email ? "input-error" : ""
                }`}
                value={newInterview.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {formErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Position *</span>
              </label>
              <input
                type="text"
                placeholder="Enter job position"
                className={`input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.position ? "input-error" : ""
                }`}
                value={newInterview.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
              {formErrors.position && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.position}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Interview Round
                </span>
              </label>
              <select
                className="select select-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.round}
                onChange={(e) => handleInputChange("round", e.target.value)}
              >
                {(INTERVIEW_ROUND_LIST || []).map((round) => (
                  <option key={round} value={round}>
                    {round}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Time</span>
              </label>
              <input
                type="time"
                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Meeting Link</span>
              </label>
              <input
                type="text"
                placeholder="Google Meet, Zoom, or Teams link"
                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.meetingLink}
                onChange={(e) =>
                  handleInputChange("meetingLink", e.target.value)
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <select
                className="select select-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-neutral"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {editingInterview ? "Updating..." : "Adding..."}
                </>
              ) : editingInterview ? (
                "Update Interview"
              ) : (
                "Add Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
