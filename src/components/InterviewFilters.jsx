export default function InterviewFilters({
  sortConfig,
  onSort,
  searchTerm,
  totalResults,
}) {
  return (
    <div className="bg-base-100 p-4 rounded-xl shadow">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-outline ${
              sortConfig.key === "candidate" ? "btn-active" : ""
            }`}
            onClick={() => onSort("candidate")}
          >
            Sort by Name{" "}
            {sortConfig.key === "candidate"
              ? sortConfig.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </button>

          <button
            className={`btn btn-outline ${
              sortConfig.key === "date" ? "btn-active" : ""
            }`}
            onClick={() => onSort("date")}
          >
            Sort by Date{" "}
            {sortConfig.key === "date"
              ? sortConfig.direction === "asc"
                ? "↑"
                : "↓"
              : ""}
          </button>
        </div>

        {searchTerm && (
          <span className="badge badge-ghost w-full md:w-auto text-sm">
            Found {totalResults} results for "{searchTerm}"
          </span>
        )}
      </div>
    </div>
  );
}
