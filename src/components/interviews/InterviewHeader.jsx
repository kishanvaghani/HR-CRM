export default function InterviewHeader({ searchTerm, setSearchTerm, onAddInterview }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h2 className="text-3xl font-bold">Interview Management</h2>
        <p className="text-base-content/60 mt-1">Automatic progression between rounds</p>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        {/* Search Bar */}
        <div className="form-control">
          <div className="relative">
            <input
              type="text"
              placeholder="Search interviews..."
              className="w-full md:w-64 pr-10 pl-4 py-2 input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                onClick={() => setSearchTerm("")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <button
          type="button"
          className="btn btn-neutral"
          onClick={onAddInterview}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Interview
        </button>
      </div>
    </div>
  );
}
