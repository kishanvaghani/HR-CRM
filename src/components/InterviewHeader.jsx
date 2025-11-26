export default function InterviewHeader({
  searchTerm,
  setSearchTerm,
  onAddInterview,
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
      <div>
        <h2 className="text-3xl font-bold">Interview Management</h2>
        <p className="text-base-content/60 mt-1">
          Automatic progression between rounds
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div className="form-control w-full sm:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search interviews..."
              className="w-full input input-bordered pl-4 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2"
              >
                ❌
              </button>
            )}
          </div>
        </div>

        <button
          className="btn btn-neutral w-full sm:w-auto"
          onClick={onAddInterview}
        >
          ➕ Add Interview
        </button>
      </div>
    </div>
  );
}
