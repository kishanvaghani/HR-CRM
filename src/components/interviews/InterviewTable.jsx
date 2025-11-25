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
  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className={`badge ${badgeColor} badge-lg`}>
          {interviews.length} {interviews.length === 1 ? "item" : "items"}
        </span>
      </div>

      {interviews.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Position</th>
                <th>Date</th>
                <th>Time</th>
                <th>Round</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content p-2 rounded-full w-8">
                          <span className="text-xs">
                            {getAvatarInitial(item?.candidate)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {getCandidateName(item?.candidate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item?.email || "No email"}</td>
                  <td>{item?.position || "No position"}</td>
                  <td>{item?.date || "Not set"}</td>
                  <td>{item?.time || "Not set"}</td>
                  <td>
                    <span
                      className={`badge whitespace-nowrap ${
                        item?.round === "1st Round"
                          ? "badge-neutral px-3 py-1"
                          : item?.round === "2nd Round"
                          ? "badge-secondary px-3 py-1"
                          : "badge-accent px-3 py-1"
                      }`}
                    >
                      {item?.round || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={item?.status || "Pending"}
                      onChange={(e) =>
                        onStatusUpdate(item?._id, e.target.value)
                      }
                      className={`select select-bordered select-sm ${
                        item?.status === "Completed"
                          ? "select-success"
                          : item?.status === "Scheduled"
                          ? "select-info"
                          : "select-warning"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => onSendEmail(item)}
                        disabled={!item?.email}
                        title="Send Email"
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
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => onEdit(item)}
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
                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={() => onDelete(item?._id)}
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
  );
}
