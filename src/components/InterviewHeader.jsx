// export default function InterviewHeader({ searchTerm, setSearchTerm, onAddInterview }) {
//   return (
//     <div className="flex justify-between items-center flex-wrap gap-4">
//       <div>
//         <h2 className="text-3xl font-bold">Interview Management</h2>
//         <p className="text-base-content/60 mt-1">Automatic progression between rounds</p>
//       </div>
//       <div className="flex gap-4 items-center flex-wrap">
        
//         <div className="form-control">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search interviews..."
//               className="w-64 pr-10 pl-4 py-2 input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
//                 onClick={() => setSearchTerm("")}
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             )}
//           </div>
//         </div>
        
//         <button
//           className="btn btn-neutral"
//           onClick={onAddInterview}
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Add Interview
//         </button>
//       </div>
//     </div>
//   );
// }

export default function InterviewHeader({ searchTerm, setSearchTerm, onAddInterview }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">

      <div>
        <h2 className="text-3xl font-bold">Interview Management</h2>
        <p className="text-base-content/60 mt-1">Automatic progression between rounds</p>
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

        <button className="btn btn-neutral w-full sm:w-auto" onClick={onAddInterview}>
          ➕ Add Interview
        </button>
      </div>
    </div>
  );
}
