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

      // Convert UI filter to backend filter if needed (unused in current API call)
      let apiFilter = filter;
      if (filter === "1st Round") apiFilter = "1st-round";
      if (filter === "2nd Round") apiFilter = "2nd-round";

      console.log("🔍 Fetching interviews with:", apiFilter);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/interviews/filter`
      );

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

  // Group interviews by date: today, yesterday, and upcoming
  const groupInterviewsByDate = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Helper to reset time part of date to 00:00:00 for accurate comparison
    const resetTime = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const todayReset = resetTime(today).getTime();
    const yesterdayReset = resetTime(yesterday).getTime();

    const todayInterviews = [];
    const yesterdayInterviews = [];
    const upcomingInterviews = [];

    data.forEach((interview) => {
      if (!interview.date) {
        upcomingInterviews.push(interview); // No date = upcoming
        return;
      }

      const interviewDate = new Date(interview.date);
      const interviewDateReset = resetTime(interviewDate).getTime();

      if (interviewDateReset === todayReset) {
        todayInterviews.push(interview);
      } else if (interviewDateReset === yesterdayReset) {
        yesterdayInterviews.push(interview);
      } else if (interviewDateReset > todayReset) {
        upcomingInterviews.push(interview);
      }
    });

    return { todayInterviews, yesterdayInterviews, upcomingInterviews };
  };

  // Apply UI filter to a given array of interviews
  const applyFilter = (data) => {
    if (filter === "all") return data;
    if (filter === "other") {
      // Other is rounds except 1st Round and 2nd Round
      return data.filter(
        (i) => i.round !== "1st Round" && i.round !== "2nd Round"
      );
    }
    return data.filter((i) => i.round === filter);
  };

  // Auto reload on filter change
  useEffect(() => {
    fetchData();
  }, [filter]);

  const { todayInterviews, yesterdayInterviews, upcomingInterviews } =
    groupInterviewsByDate(interviews);

  const filteredToday = applyFilter(todayInterviews);
  const filteredYesterday = applyFilter(yesterdayInterviews);
  const filteredUpcoming = applyFilter(upcomingInterviews);

  // ============ Format Helpers ============
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not set";

  const getDaysUntilDate = (dateString) => {
    if (!dateString) return "TBD";
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : "Today";
  };

  const getAvatarInitial = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name.charAt(0).toUpperCase();
  };

  // ============ Loading UI ============
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg mb-2"></span>
          <p className="font-medium">Loading Interviews...</p>
        </div>
      </div>
    );

  // Common rendering for interview table
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
                {data.map((item) => (
                  <tr key={item._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder w-10 h-10 shrink-0">
                          <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                            {getAvatarInitial(item.candidate)}
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

                    <td>{item.position || "-"}</td>

                    <td>{formatDate(item.date)}</td>

                    <td>{item.time || "Not set"}</td>

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

                    <td className="text-center">
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
                    </td>

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
          <button onClick={fetchData} className="btn btn-primary btn-sm">
            Refresh Data
          </button>
        </div>
      )}
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
        <div className="bg-white p-4 rounded-xl shadow mb-8">
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
              {filteredToday.length +
                filteredYesterday.length +
                filteredUpcoming.length}{" "}
              interviews
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <div>
              <span>{error}</span>
              <button onClick={fetchData} className="btn btn-sm btn-ghost ml-4">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Today Interviews Table */}
        {renderInterviewTable(filteredToday, "Today's Interviews", "Priority")}

        {/* Upcoming Interviews Table */}
        {renderInterviewTable(
          filteredUpcoming,
          "Upcoming Interviews",
          getDaysUntilDate(upcomingInterviews[0]?.date)
        )}

        {/* Yesterday Interviews Table */}
        {renderInterviewTable(filteredYesterday, "Yesterday's Interviews")}

        {/* Data Summary */}
        {interviews.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            <p>
              Showing{" "}
              {filteredToday.length +
                filteredYesterday.length +
                filteredUpcoming.length}{" "}
              of {interviews.length} total interviews
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
