// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Interviews() {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingInterview, setEditingInterview] = useState(null);

//   const [newInterview, setNewInterview] = useState({
//     candidate: "",
//     email: "",
//     position: "",
//     date: "",
//     time: "",
//     meetingLink: "",
//     status: "Pending",
//     round: "1st Round"
//   });

//   const [interviews, setInterviews] = useState([]);


//   const fetchInterviews = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/interviews");
//       setInterviews(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error("Error fetching interviews", err);
//       alert("Failed to fetch interviews");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInterviews();
//   }, []);

  
//   const handleAddInterview = async () => {
//     if (!newInterview.candidate || !newInterview.email || !newInterview.position) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       if (editingInterview) {
//         await axios.put(`http://localhost:5000/api/interviews/${editingInterview._id}`, newInterview);
//       } else {
//         await axios.post("http://localhost:5000/api/interviews", newInterview);
//       }
//       await fetchInterviews();
//       setShowModal(false);
//       resetForm();
//     } catch (err) {
//       console.error("Error saving interview", err);
//       alert("Failed to save interview");
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const updateInterviewStatus = async (interviewId, newStatus) => {
//     try {
//       const res = await axios.put(`http://localhost:5000/api/interviews/${interviewId}`, {
//         status: newStatus
//       });
      
//       await fetchInterviews();
      
//       if (newStatus === "Completed") {
//         alert(res.data.message || "Interview completed and progressed to next round!");
//       } else {
//         alert("Interview updated successfully!");
//       }
//     } catch (err) {
//       console.error("Error updating interview", err);
//       alert("Failed to update interview");
//     }
//   };

  
//   const deleteInterview = async (interviewId) => {
//     if (window.confirm("Are you sure you want to delete this interview?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/interviews/${interviewId}`);
//         await fetchInterviews();
//         alert("Interview deleted successfully!");
//       } catch (err) {
//         console.error("Error deleting interview", err);
//         alert("Failed to delete interview");
//       }
//     }
//   };


//   const sendMail = async (interview) => {
//     try {
//       await axios.post("http://localhost:5000/api/email/send", {
//         email: interview.email,
//         candidate: interview.candidate,
//         position: interview.position,
//         date: interview.date,
//         time: interview.time,
//         meetingLink: interview.meetingLink || "https://meet.google.com/",
//       });
//       alert("Email sent successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send email");
//     }
//   };


//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

  
//   const filterInterviewsBySearch = (interviewList) => {
//     if (!searchTerm.trim()) return interviewList;
    
//     const lowercasedSearch = searchTerm.toLowerCase();
//     return interviewList.filter(item =>
//       item?.candidate?.toLowerCase().includes(lowercasedSearch) ||
//       item?.email?.toLowerCase().includes(lowercasedSearch) ||
//       item?.position?.toLowerCase().includes(lowercasedSearch) ||
//       item?.round?.toLowerCase().includes(lowercasedSearch) ||
//       item?.status?.toLowerCase().includes(lowercasedSearch)
//     );
//   };

//   const sortedInterviews = (interviewList) => {
//     if (!sortConfig.key) return interviewList;
    
//     return [...interviewList].sort((a, b) => {
//       const aValue = a[sortConfig.key] || '';
//       const bValue = b[sortConfig.key] || '';
      
//       if (aValue < bValue) {
//         return sortConfig.direction === 'asc' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//   };


//   const firstRoundInterviews = sortedInterviews(
//     filterInterviewsBySearch(
//       interviews.filter(item => item?.status !== "Completed" && item?.round === "1st Round")
//     )
//   );

//   const secondRoundInterviews = sortedInterviews(
//     filterInterviewsBySearch(
//       interviews.filter(item => item?.status !== "Completed" && item?.round === "2nd Round")
//     )
//   );

//   const finalRoundInterviews = sortedInterviews(
//     filterInterviewsBySearch(
//       interviews.filter(item => item?.status !== "Completed" && item?.round === "Final Round")
//     )
//   );

//   const completedInterviews = sortedInterviews(
//     filterInterviewsBySearch(
//       interviews.filter(item => item?.status === "Completed")
//     )
//   );

 
//   const getAvatarInitial = (candidate) => {
//     if (!candidate || typeof candidate !== 'string') return '?';
//     return candidate.charAt(0).toUpperCase();
//   };

  
//   const getCandidateName = (candidate) => {
//     return candidate || 'Unknown Candidate';
//   };

//   const renderTable = (interviewList, title, badgeColor = "badge-neutral") => (
//     <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-xl font-semibold">
//           {title} 
//         </h3>
//         <span className={`badge ${badgeColor} badge-lg`}>
//           {interviewList.length} {interviewList.length === 1 ? 'item' : 'items'}
//         </span>
//       </div>

//       {interviewList.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="table table-zebra">
           
//             <thead>
//               <tr>
//                 <th>Candidate</th>
//                 <th>Email</th>
//                 <th>Position</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Round</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {interviewList.map((item, i) => (
//                 <tr key={i}>
//                   <td>
//                     <div className="flex items-center space-x-3">
//                       <div className="avatar placeholder">
//                         <div className="bg-neutral text-neutral-content p-2 rounded-full w-8">
//                           <span className="text-xs">{getAvatarInitial(item?.candidate)}</span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-bold">{getCandidateName(item?.candidate)}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>{item?.email || 'No email'}</td>
//                   <td>{item?.position || 'No position'}</td>
//                   <td>{item?.date || "Not set"}</td>
//                   <td>{item?.time || "Not set"}</td>
//                   <td>
//                     <span
//                       className={`badge whitespace-nowrap ${
//                         item?.round === "1st Round" ? "badge-neutral px-3 py-1" :
//                         item?.round === "2nd Round" ? "badge-secondary px-3 py-1" :
//                         "badge-accent px-3 py-1"
//                       }`}
//                     >
//                       {item?.round || 'Unknown'}
//                     </span>
//                   </td>
//                   <td>
//                     <select
//                       value={item?.status || 'Pending'}
//                       onChange={(e) => updateInterviewStatus(item?._id, e.target.value)}
//                       className={`select select-bordered select-sm ${
//                         item?.status === "Completed" ? "select-success" :
//                         item?.status === "Scheduled" ? "select-info" :
//                         "select-warning"
//                       }`}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Scheduled">Scheduled</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </td>
//                   <td>
//                     <div className="flex gap-1">
//                       <button
//                         className="btn btn-success btn-sm"
//                         onClick={() => sendMail(item)}
//                         disabled={!item?.email}
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                       </button>
//                       <button
//                         className="btn btn-info btn-sm"
//                         onClick={() => {
//                           setEditingInterview(item);
//                           setNewInterview(item);
//                           setShowModal(true);
//                         }}
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                       </button>
//                       <button
//                         className="btn btn-error btn-sm"
//                         onClick={() => deleteInterview(item?._id)}
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center p-8 text-base-content/60 bg-base-200 rounded-lg">
//           <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           {searchTerm ? "No interviews match your search" : "No interviews found"}
//         </div>
//       )}
//     </div>
//   );

//   const resetForm = () => {
//     setNewInterview({
//       candidate: "",
//       email: "",
//       position: "",
//       date: "",
//       time: "",
//       meetingLink: "",
//       status: "Pending",
//       round: "1st Round"
//     });
//     setEditingInterview(null);
//   };

//   return (
//     <div className="p-6 space-y-8">
      
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h2 className="text-3xl font-bold">Interview Management</h2>
//           <p className="text-base-content/60 mt-1">Automatic progression between rounds</p>
//         </div>
//         <div className="flex gap-4 items-center flex-wrap">
         
//           <div className="form-control">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search interviews..."
//                 className="w-64 pr-10 pl-4 py-2 input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <button
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
//                   onClick={() => setSearchTerm("")}
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <button
//             className="btn btn-neutral"
//             onClick={() => {
//               resetForm();
//               setShowModal(true);
//             }}
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Interview
//           </button>
//         </div>
//       </div>

    
//       <div className="alert alert-info">
//         <div className="flex items-center">
//           <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//           </svg>
//           <div>
//             <h3 className="font-semibold">Automatic Progression</h3>
//             <p className="text-sm">
//               When you mark an interview as "Completed", it automatically progresses to the next round:
//               1st Round → 2nd Round → Final Round
//             </p>
//           </div>
//         </div>
//       </div>

      
//       {loading && interviews.length === 0 && (
//         <div className="text-center py-8">
//           <span className="loading loading-spinner loading-lg"></span>
//           <p className="mt-2">Loading interviews...</p>
//         </div>
//       )}

     
//       <div className="bg-base-100 p-4 rounded-xl shadow">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div className="flex gap-2 flex-wrap">
//             <button
//               className={`btn btn-outline ${sortConfig.key === 'candidate' ? 'btn-active' : ''}`}
//               onClick={() => handleSort('candidate')}
//             >
//               Sort by Name 
//               {sortConfig.key === 'candidate' && (
//                 sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
//               )}
//             </button>
//             <button
//               className={`btn btn-outline ${sortConfig.key === 'date' ? 'btn-active' : ''}`}
//               onClick={() => handleSort('date')}
//             >
//               Sort by Date
//               {sortConfig.key === 'date' && (
//                 sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
//               )}
//             </button>
//           </div>
          
//           {searchTerm && (
//             <div className="badge badge-ghost">
//               Found {firstRoundInterviews.length + secondRoundInterviews.length + finalRoundInterviews.length + completedInterviews.length} results for "{searchTerm}"
//             </div>
//           )}
//         </div>
//       </div>

      
//       {!loading && (
//         <>
//           {renderTable(firstRoundInterviews, "1st Round Interviews", "badge-neutral")}
//           {renderTable(secondRoundInterviews, "2nd Round Interviews", "badge-secondary")}
//           {renderTable(finalRoundInterviews, "Final Round Interviews", "badge-accent")}
//           {renderTable(completedInterviews, "Completed Interviews", "badge-ghost")}
//         </>
//       )}

     
//      {showModal && (
//   <div className="modal modal-open">
//     <div className="modal-box max-w-2xl">
//       <h3 className="font-bold text-lg mb-6">
//         {editingInterview ? "Edit Interview" : "Schedule New Interview"}
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Candidate Name *</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter candidate name"
//             className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
//             value={newInterview.candidate}
//             onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
//           />
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Email *</span>
//           </label>
//           <input
//             type="email"
//             placeholder="Enter email address"
//             className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
//             value={newInterview.email}
//             onChange={(e) => setNewInterview({ ...newInterview, email: e.target.value })}
//           />
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Position *</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter job position"
//             className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
//             value={newInterview.position}
//             onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
//           />
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Interview Round</span>
//           </label>
//  <select
//   className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-neutral"
//   value={newInterview.round}
//   onChange={(e) => setNewInterview({ ...newInterview, round: e.target.value })}
// >
//   <option value="1st Round">1st Round</option>
//   <option value="2nd Round">2nd Round</option>
//   <option value="Final Round">Final Round</option>
// </select>


//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Date</span>
//           </label>
//           <input
//             type="date"
//             className="input input-bordered  w-full  focus:outline-none focus:ring-2 focus:ring-neutral"
//             value={newInterview.date}
//             onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
//           />
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Time</span>
//           </label>
//           <input
//             type="time"
//             className="input input-bordered focus:outline-none focus:ring-2 focus:ring neutral"
//             value={newInterview.time}
//             onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
//           />
//         </div>

//         <div className="form-control md:col-span-2">
//           <label className="label">
//             <span className="label-text font-semibold">Meeting Link</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Google Meet, Zoom, or Teams link"
//             className="input input-bordered focus:outline-none focus:ring-2 focus:ring-neutral"
//             value={newInterview.meetingLink}
//             onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
//           />
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text font-semibold">Status</span>
//           </label>
//           <select
//             className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-neutral"
//             value={newInterview.status}
//             onChange={(e) => setNewInterview({ ...newInterview, status: e.target.value })}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Scheduled">Scheduled</option>
//             <option value="Completed">Completed</option>
//           </select>
//         </div>
//       </div>

//       <div className="modal-action mt-6">
//         <button
//           className="btn btn-outline"
//           onClick={() => {
//             setShowModal(false);
//             resetForm();
//           }}
//           disabled={loading}
//         >
//           Cancel
//         </button>

//         <button
//           className="btn btn-neutral"
//           onClick={handleAddInterview}
//           disabled={loading}
//         >
//           {loading ? (
//             <>
//               <span className="loading loading-spinner loading-sm"></span>
//               {editingInterview ? "Updating..." : "Adding..."}
//             </>
//           ) : editingInterview ? (
//             "Update Interview"
//           ) : (
//             "Add Interview"
//           )}
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }


import React from 'react'
import Interviews from '../components/Interviews'

const InterviewsMain = () => {
  return (
   <Interviews/>
  )
}

export default InterviewsMain