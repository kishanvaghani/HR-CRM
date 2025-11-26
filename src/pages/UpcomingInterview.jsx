import { useState, useEffect } from "react";
import { interviewService } from "../services/interviewService";

/* 🔹 Name Initials */
const getAvatarInitial = (candidate) => {
  return candidate ? candidate.charAt(0).toUpperCase() : "?";
};

/* 🔹 Format Interview Dates */
const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getUpcomingInterviews(filter);
      if (res.data?.success) setInterviews(res.data.data);
      else setError("Failed to load interview data");
    } catch (err) {
      setError("Request failed: " + err.message);
    }
    setLoading(false);
  };

  const filtered = interviews.filter((i) =>
    filter === "all" ? true : i.round === filter
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:ml-64 bg-base-200">
      <div className="max-w-7xl mx-auto">

        {/* ------------ HEADER ---------------- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Upcoming Interviews</h1>
          <button onClick={fetchData} className="btn btn-outline btn-sm">Refresh</button>
        </div>

        {/* ------------ FILTER BAR ---------------- */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-4">
          <select
            className="select select-bordered select-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="1st Round">1st Round</option>
            <option value="2nd Round">2nd Round</option>
          </select>

          <div className="ml-auto badge badge-primary badge-lg">
            {filtered.length} Items
          </div>
        </div>

        {/* ------------ ERROR MESSAGE ---------------- */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button onClick={fetchData} className="btn btn-xs ml-3">Retry</button>
          </div>
        )}

        {/* ------------ MAIN TABLE UI ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200 text-base font-semibold">
                <tr>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Round</th>
                  <th>Current CTC</th>
                  <th>Expected CTC</th>
                  <th>Joining</th>
                  <th>Meeting Link</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item._id} className="hover">

                      {/* Candidate Avatar + name */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-10 bg-neutral text-white rounded-full">
                              {getAvatarInitial(item?.candidate)}
                            </div>
                          </div>
                          <span className="font-bold">{item.candidate}</span>
                        </div>
                      </td>

                      <td>{item.email || "-"}</td>
                      <td>{item.position || "-"}</td>
                      <td>{item.date ? formatDate(item.date) : "-"}</td>
                      <td>{item.time || "-"}</td>

                      <td><span className="badge badge-secondary">{item.round}</span></td>

                      <td>{item.currentCTC ? `₹${item.currentCTC} LPA` : "-"}</td>

                      <td className="text-green-600 font-semibold">
                        {item.expectedCTC ? `₹${item.expectedCTC} LPA` : "-"}
                      </td>

                      <td>{item.dateOfJoining ? formatDate(item.dateOfJoining) : "-"}</td>

                      <td>
                        {item.meetingLink ? (
                          <a href={item.meetingLink} target="_blank"
                             className="btn btn-sm btn-outline btn-primary">
                            Join
                          </a>
                        ) : (
                          <span className="text-gray-400">No Link</span>
                        )}
                      </td>

                      <td>
                        <span className="badge badge-info">{item.status || "Pending"}</span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="flex gap-2">
                        <button className="btn btn-xs btn-success">✉</button>
                        <button className="btn btn-xs btn-info">✎</button>
                        <button className="btn btn-xs btn-error">🗑</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-10 text-gray-500">
                      No Interviews Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
