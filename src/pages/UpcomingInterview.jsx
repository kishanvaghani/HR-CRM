import { useState, useEffect } from "react";
import axios from "axios";

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // ================== API CALL ==================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Convert UI filter to backend filter
      let apiFilter = filter;
      if (filter === "1st Round") apiFilter = "1st-round";
      if (filter === "2nd Round") apiFilter = "2nd-round";

      console.log("🔍 Fetching interviews with:", apiFilter);

      const res = await axios.get(`http://localhost:5000/api/interviews/filter`);

      console.log("📥 API Response:", res.data);

      if (res.data.success) {
        setInterviews(res.data.data);
      } else {
        setError("API returned no success response");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Server not responding, please try again.");
    } finally {
      setLoading(false);
    }
  };

   const getAvatarInitial = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  // Auto reload on filter change
  useEffect(() => {
    fetchData();
  }, [filter]);

  const filteredData = filter === "all" ? interviews : interviews.filter(i => i.round === filter);

  // ============ Format Helpers ============
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "Not set";
  const initial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  // ============ Loading UI ============
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg mb-2"></span>
        <p className="font-medium">Loading Interviews...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Upcoming Interviews</h1>
          <button 
            onClick={fetchData} 
            className="btn btn-outline btn-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex items-center gap-4">
            <select
              className="select select-bordered w-full max-w-xs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Rounds</option>
              <option value="1st Round">1st Round</option>
              <option value="2nd Round">2nd Round</option>
              <option value="other">Other Rounds</option>
            </select>
            
            <div className="badge badge-primary badge-lg">
              {filteredData.length} interviews
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <div>
              <span>{error}</span>
              <button 
                onClick={fetchData} 
                className="btn btn-sm btn-ghost ml-4"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold">Candidate</th>
                  <th className="font-semibold">Email</th>
                  <th className="font-semibold">Position</th>
                  <th className="font-semibold">Date</th>
                  <th className="font-semibold">Time</th>
                  <th className="font-semibold">Round</th>
                  <th className="font-semibold">Current CTC</th>
                  <th className="font-semibold">Expected CTC</th>
                  <th className="font-semibold">Joining Date</th>
                  <th className="font-semibold">Meeting Link</th>
                  <th className="font-semibold">Status</th>
                </tr>
              </thead>
              
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item._id} className="hover">
                      {/* Candidate */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span className="font-bold">
                                {getAvatarInitial(item.candidate)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{item.candidate || "Unknown"}</div>
                            <div className="text-sm text-gray-500">
                              {item.phone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>{item.email || "-"}</td>

                      {/* Position */}
                      <td>{item.position || "-"}</td>

                      {/* Date */}
                      <td>{formatDate(item.date)}</td>

                      {/* Time */}
                      <td>{item.time || "Not set"}</td>

                      {/* Round */}
                      <td>
                        <span className="badge badge-outline">
                          {item.round || "Not set"}
                        </span>
                      </td>

                      {/* Current CTC */}
                      <td>
                        {item.currentCTC ? `₹${item.currentCTC} LPA` : "-"}
                      </td>

                      {/* Expected CTC */}
                      <td>
                        {item.expectedCTC ? `₹${item.expectedCTC} LPA` : "-"}
                      </td>

                      {/* Joining Date */}
                      <td>{formatDate(item.dateOfJoining)}</td>

                      {/* Meeting Link */}
                      <td>
                        {item.meetingLink ? (
                          <a
                            href={item.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="text-gray-400">No link</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span className="badge badge-ghost">
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        
                        <h3 className="text-lg font-semibold mb-2">
                          No Interviews Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {interviews.length === 0 
                            ? "No interview data available" 
                            : `No interviews match the "${filter}" filter`
                          }
                        </p>
                        <button 
                          onClick={fetchData} 
                          className="btn btn-primary btn-sm"
                        >
                          Refresh Data
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Summary */}
        {interviews.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            <p>Showing {filteredData.length} of {interviews.length} total interviews</p>
          </div>
        )}
      </div>
    </div>
  );
}