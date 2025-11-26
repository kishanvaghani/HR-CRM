import { useState } from "react";
import useToast from "../hooks/useToast";
import { INTERVIEW_ROUND_LIST, INTERVIEW_STATUS_LIST } from "../utils/constant";

const getAvatarInitial = (candidate) => {
  if (!candidate || typeof candidate !== "string") return "?";
  return candidate.charAt(0).toUpperCase();
};

const getCandidateName = (candidate) => {
  return candidate || "Unknown Candidate";
};

export default function InterviewTable({
  interviews,
  title,
  badgeColor,
  onEdit,
  onDelete,
  onSendEmail,
  onStatusUpdate,
}) {
  const { showError, showSuccess } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [emailConfirm, setEmailConfirm] = useState(null);

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      await onStatusUpdate(interviewId, { status: newStatus });
    } catch {
      showError("Failed to update status");
    }
  };

  const handleRoundChange = async (interviewId, newRound) => {
    try {
      await onStatusUpdate(interviewId, { round: newRound });
    } catch {
      showError("Failed to update round");
    }
  };

  const handleSendEmail = async (interview) => {
    try {
      await onSendEmail(interview);
      setEmailConfirm(null);
      showSuccess("Email sent successfully!");
    } catch {
      showError("Failed to send email");
    }
  };

  const handleEdit = async (interview) => {
    try {
      await onEdit(interview);
    } catch {
      showError("Failed to load interview for editing");
    }
  };

  const handleDelete = async (interviewId) => {
    try {
      await onDelete(interviewId);
      setDeleteConfirm(null);
      showSuccess("Interview deleted successfully!");
    } catch {
      showError("Failed to delete interview");
    }
  };
  console.log("====================================aaaaaaa");
  console.log(interviews);
  console.log("====================================");
  return (
    <>
      <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className={`badge ${badgeColor} badge-lg`}>
            {interviews.length} {interviews.length === 1 ? "item" : "items"}
          </span>
        </div>

        {interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra min-w-[900px]">
              <thead>
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Round</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((item, i) => (
                  <tr key={i} className="hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full p-4 w-12">
                            <span className="text-sm font-semibold">
                              {getAvatarInitial(item?.candidate)}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            {getCandidateName(item?.candidate)}
                          </div>
                          {item?.currentCompany && (
                            <div className="text-xs text-gray-500 truncate">
                              {item.currentCompany}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="truncate" title={item?.email}>
                        {item?.email || "No email"}
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-[150px]">
                      <div className="truncate" title={item?.position}>
                        {item?.position || "No position"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm">{item?.date || "Not set"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm">{item?.time || "Not set"}</span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={item?.round ?? ""}
                        onChange={(e) =>
                          handleRoundChange(item?._id, e.target.value)
                        }
                        disabled
                        className="select select-bordered select-sm w-full max-w-[140px] 
               focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed opacity-60"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        {(INTERVIEW_ROUND_LIST || []).map((round) => (
                          <option key={round} value={round}>
                            {round}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={item?.status || ""}
                        onChange={(e) =>
                          handleStatusChange(item?._id, e.target.value)
                        }
                        className="select select-bordered select-sm w-full max-w-40 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        {(INTERVIEW_STATUS_LIST || []).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* Email Button */}
                        <button
                          className="btn btn-success btn-sm btn-square"
                          onClick={() => setEmailConfirm(item)}
                          disabled={!item?.email}
                          title={
                            item?.email ? "Send Email" : "No email available"
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </button>

                        {/* Edit Button */}
                        <button
                          className="btn btn-info btn-sm btn-square"
                          onClick={() => handleEdit(item)}
                          title="Edit Interview"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn btn-error btn-sm btn-square"
                          onClick={() => setDeleteConfirm(item)}
                          title="Delete Interview"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-base-content/60 bg-base-200 rounded-lg">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            No interviews found
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-error rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
            </div>

            <p className="py-4">
              Are you sure you want to delete the interview for{" "}
              <strong>{deleteConfirm.candidate}</strong>?
              <br />
              <span className="text-sm text-warning mt-2 block">
                This action cannot be undone and all interview data will be
                permanently lost.
              </span>
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(deleteConfirm._id)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {emailConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg">Send Email</h3>
            </div>

            <p className="py-4">
              Send interview details to{" "}
              <strong>{emailConfirm.candidate}</strong>?
              <br />
              <span className="text-sm text-info mt-2 block">
                Email will be sent to: {emailConfirm.email}
              </span>
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setEmailConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleSendEmail(emailConfirm)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
