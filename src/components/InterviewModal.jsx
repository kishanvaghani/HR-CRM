import { useState } from "react";
import { INTERVIEW_ROUND_LIST } from "../utils/constant";

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

  // Validate form before submission
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

    if (!newInterview.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(newInterview.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!newInterview.position?.trim()) {
      errors.position = "Position is required";
    }

    if (newInterview.currentCTC && isNaN(newInterview.currentCTC)) {
      errors.currentCTC = "Current CTC must be a number";
    }

    if (newInterview.expectedCTC && isNaN(newInterview.expectedCTC)) {
      errors.expectedCTC = "Expected CTC must be a number";
    }

    if (newInterview.totalExperience && isNaN(newInterview.totalExperience)) {
      errors.totalExperience = "Total experience must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced submit handler
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

  // Handle input changes with error clearing
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
    <div className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
      <div className="modal-box w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="shrink-0 px-4 pt-4">
          <h3 className="font-bold text-lg mb-6">
            {editingInterview ? "Edit Interview" : "Schedule New Interview"}
          </h3>
        </div>
        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            .flex-1.overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Input fields: use w-full for mobile */}
            {/* Candidate Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Candidate Name *
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter candidate name"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
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
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email *</span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
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
            {/* PHONE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone *</span>
              </label>
              <input
                type="tel"
                placeholder="Enter Phone address"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.phone ? "input-error" : ""
                }`}
                value={newInterview?.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              {formErrors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.phone}
                  </span>
                </label>
              )}
            </div>
            {/* ...(repeat the rest with w-full on inputs and proper gaps) */}
            {/* Position */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Position *</span>
              </label>
              <input
                type="text"
                placeholder="Enter job position"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
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

            {/* Current CTC */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Current CTC (LPA)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.currentCTC ? "input-error" : ""
                }`}
                value={newInterview.currentCTC || ""}
                onChange={(e) =>
                  handleInputChange("currentCTC", e.target.value)
                }
              />
              {formErrors.currentCTC && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.currentCTC}
                  </span>
                </label>
              )}
            </div>
            {/* Expected CTC */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Expected CTC (LPA)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="3.5"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.expectedCTC ? "input-error" : ""
                }`}
                value={newInterview.expectedCTC || ""}
                onChange={(e) =>
                  handleInputChange("expectedCTC", e.target.value)
                }
              />
              {formErrors.expectedCTC && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.expectedCTC}
                  </span>
                </label>
              )}
            </div>
            {/* Total Experience */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Total Experience (Years)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter total experience"
                className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral ${
                  formErrors.totalExperience ? "input-error" : ""
                }`}
                value={newInterview.totalExperience || ""}
                onChange={(e) =>
                  handleInputChange("totalExperience", e.target.value)
                }
              />
              {formErrors.totalExperience && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {formErrors.totalExperience}
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
                className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
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
            {/* Expected Date of Joining */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Expected Date of Joining
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.dateOfJoining || ""}
                onChange={(e) =>
                  handleInputChange("dateOfJoining", e.target.value)
                }
              />
            </div>
            {/* Interview Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Interview Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            {/* Interview Time */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Interview Time</span>
              </label>
              <input
                type="time"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
            {/* Meeting Link */}
            <div className="form-control md:col-span-2 ">
              <label className="label">
                <span className="label-text font-semibold">Meeting Link</span>
              </label>
              <input
                type="text"
                placeholder="Google Meet, Zoom, or Teams link"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.meetingLink}
                onChange={(e) =>
                  handleInputChange("meetingLink", e.target.value)
                }
              />
            </div>
            {/* Notice Period */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Notice Period (Days)
                </span>
              </label>
              <input
                type="number"
                placeholder="Enter notice period"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.noticePeriod || ""}
                onChange={(e) =>
                  handleInputChange("noticePeriod", e.target.value)
                }
              />
            </div>
            {/* Current Company */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Current Company
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter current company"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-neutral"
                value={newInterview.currentCompany || ""}
                onChange={(e) =>
                  handleInputChange("currentCompany", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="modal-action mt-6 shrink-0 px-4 pb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <button
            className="btn btn-outline w-full sm:w-auto"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn btn-neutral w-full sm:w-auto"
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}
