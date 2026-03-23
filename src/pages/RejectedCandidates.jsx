import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import interviewService from "../services/interviewService";
import InterviewTable from "../components/InterviewTable";
import { getAvatarInitial } from "../utils/constant";
import { convertTo12Hour } from "../utils/convertTo12Hour";

export default function RejectedCandidates() {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectedInterviews = async () => {
      try {
        const response =
          await interviewService.getAllInterviews("only_rejected");
        setInterviews(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch rejected interviews.");
        setLoading(false);
      }
    };

    fetchRejectedInterviews();
  }, [dispatch]);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not set";

  const renderInterviewTable = (data, title, subtitle = "") => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle && (
          <span className="badge badge-info text-sm">{subtitle}</span>
        )}
        {data.length > 0 && (
          <div className="badge badge-primary ml-auto">
            {data.length} interview{data.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <div className="rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold">Candidate</th>
                  <th className="font-semibold">Email</th>
                  {/* <th className="font-semibold">Position</th> */}
                  <th className="font-semibold">Date</th>
                  <th className="font-semibold">Time</th>
                  <th className="font-semibold">Round</th>
                  <th className="font-semibold">Current CTC</th>
                  <th className="font-semibold">Expected CTC</th>
                  <th className="font-semibold">Joining Date</th>
                  {/* <th className="font-semibold">Meeting Link</th> */}
                  {/* <th className="font-semibold">Mail status</th> */}
                  <th className="font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {(data || []).map((item, i) => (
                  <tr key={item._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder w-10 h-10 shrink-0">
                          <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                            {getAvatarInitial((i + 1)?.toString())}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">
                            {item.candidate || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {item.phone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-48">
                      <span className="truncate block">
                        {item.email || "-"}
                      </span>
                    </td>

                    {/* <td>{item.position || "-"}</td> */}

                    <td>
                      {" "}
                      <span className={`text-sm `}>
                        {formatDate(item.date)}
                      </span>
                      {/* {formatDate(item.date)} */}
                    </td>

                    <td>{convertTo12Hour(item?.time || "") || "Not set"}</td>

                    <td>
                      <span className="badge badge-outline px-3 py-0 text-sm inline-block truncate max-w-32">
                        {item.round || "Not set"}
                      </span>
                    </td>

                    <td>{item.currentCTC ? `₹${item.currentCTC} LPA` : "-"}</td>

                    <td>
                      {item.expectedCTC ? `₹${item.expectedCTC} LPA` : "-"}
                    </td>

                    <td>{formatDate(item.dateOfJoining)}</td>

                    {/* <td className="text-center">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-outline btn-primary whitespace-nowrap"
                        >
                          Join
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No link</span>
                      )}
                    </td> */}
                    {/* <td>
                      <span
                        className={`badge badge-ghost ${
                          item?.emailSent ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {item?.emailSent ? "sent" : "failed"}
                      </span>
                    </td> */}

                    <td>
                      <span className="badge badge-ghost">
                        {item.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-500">
            No Interviews Found
          </h3>
          <p className="text-gray-500 mb-4">
            {interviews.length === 0
              ? "No interview data available"
              : `No ${title.toLowerCase()} matching the "${filter}" filter`}
          </p>
          <button
            onClick={() => fetchData("recent3")}
            className="btn btn-primary btn-sm"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rejected Interviews</h1>
          <button
            onClick={() => fetchData("recent3")}
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Filter */}
        <div className="p-4 rounded-xl shadow mb-8">
          <div className="flex items-center gap-4">
            <select
              className="select select-bordered w-full max-w-xs"
              //   value={filter}
              //   onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Rounds</option>
              <option value="1st Round">1st Round</option>
              <option value="2nd Round">2nd Round</option>
              <option value="other">Other Rounds</option>
            </select>

            <div className="badge badge-primary badge-lg">
              {interviews.length} interviews
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <div>
              <span>{error}</span>
              <button
                onClick={() => fetchData("recent3")}
                className="btn btn-sm btn-ghost ml-4"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Today Interviews Table */}
        {renderInterviewTable(interviews, "Rejected Candidates", "Priority")}

        {/* Data Summary */}
        {interviews.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            <p>
              Showing {interviews.length} of {interviews.length} total
              interviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
