import { useState, useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchInterviews,
  addInterview,
  updateInterview,
  deleteInterview as deleteInterviewThunk,
  showModal,
  hideModal,
} from "../features/interviews/interviewsSlice";
import {
  selectAllInterviews,
  selectInterviewLoading,
  selectInterviewError,
  selectModalState,
  selectSelectedInterview,
} from "../features/interviews/interviewsSelectors";
import useToast from "../hooks/useToast";
import InterviewTable from "./InterviewTable";
import InterviewModal from "./InterviewModal";
import InterviewHeader from "./InterviewHeader";
import InterviewFilters from "./InterviewFilters";
import { INTERVIEW_ROUNDS } from "../utils/constant";

const initialInterviewState = {
  candidate: "",
  email: "",
  phone: "",
  position: "",
  date: "",
  time: "",
  meetingLink: "",
  status: "",
  round: INTERVIEW_ROUNDS["PENDING"],
  currentCTC: "",
  expectedCTC: "",
  totalExperience: "",
  dateOfJoining: "",
  noticePeriod: "",
  currentCompany: "",
};

export default function Interviews() {
  const dispatch = useAppDispatch();
  const { showSuccess, showError, showWarning } = useToast();

  const interviews = useAppSelector(selectAllInterviews);
  const loading = useAppSelector(selectInterviewLoading);
  const error = useAppSelector(selectInterviewError);
  const modalState = useAppSelector(selectModalState);
  const selectedInterview = useAppSelector(selectSelectedInterview);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [newInterview, setNewInterview] = useState(initialInterviewState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showInitialLoader = loading && interviews.length === 0;

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  useEffect(() => {
    if (!modalState.show) {
      setNewInterview(initialInterviewState);
      return;
    }

    if (modalState.editing && selectedInterview) {
      setNewInterview({
        candidate: selectedInterview.candidate || "",
        email: selectedInterview.email || "",
        phone: selectedInterview.phone || "",
        position: selectedInterview.position || "",
        date: selectedInterview.date || "",
        time: selectedInterview.time || "",
        meetingLink: selectedInterview.meetingLink || "",
        status: selectedInterview.status || "",
        round: selectedInterview.round || "",
        currentCTC: selectedInterview.currentCTC || "",
        expectedCTC: selectedInterview.expectedCTC || "",
        totalExperience: selectedInterview.totalExperience || "",
        dateOfJoining: selectedInterview.dateOfJoining || "",
        noticePeriod: selectedInterview.noticePeriod || "",
        currentCompany: selectedInterview.currentCompany || "",
      });
    } else {
      setNewInterview(initialInterviewState);
    }
  }, [modalState.show, modalState.editing, selectedInterview]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filterInterviewsBySearch = (interviewList) => {
    if (!searchTerm.trim()) return interviewList;

    const lower = searchTerm.toLowerCase();
    return interviewList.filter(
      (item) =>
        item?.candidate?.toLowerCase().includes(lower) ||
        item?.email?.toLowerCase().includes(lower) ||
        item?.position?.toLowerCase().includes(lower) ||
        item?.round?.toLowerCase().includes(lower) ||
        item?.status?.toLowerCase().includes(lower) ||
        item?.currentCompany?.toLowerCase().includes(lower)
    );
  };

  const sortedInterviews = (interviewList) => {
    if (!sortConfig.key) return interviewList;

    return [...interviewList].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (
        [
          "currentCTC",
          "expectedCTC",
          "totalExperience",
          "noticePeriod",
        ].includes(sortConfig.key)
      ) {
        const numA = parseFloat(aValue) || 0;
        const numB = parseFloat(bValue) || 0;
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };
  const pendingInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS["PENDING"])
    )
  );
  const firstRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS["FIRSTROUND"])
    )
  );

  const secondRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter(
        (item) => item.round === INTERVIEW_ROUNDS["SECONDROUND"]
      )
    )
  );

  const finalRoundInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS["FINALROUND"])
    )
  );

  const hiredInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS["HIRED"])
    )
  );

  const rejectedInterviews = sortedInterviews(
    filterInterviewsBySearch(
      interviews.filter((item) => item.round === INTERVIEW_ROUNDS["REJECTED"])
    )
  );

  const totalResults =
    firstRoundInterviews.length +
    pendingInterviews.length +
    secondRoundInterviews.length +
    finalRoundInterviews.length +
    hiredInterviews.length +
    rejectedInterviews.length;

  const resetForm = () => setNewInterview(initialInterviewState);

  const handleSubmitInterview = async () => {
    if (
      !newInterview.candidate ||
      !newInterview.phone ||
      !newInterview.email ||
      !newInterview.position
    ) {
      showWarning("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalState.editing && selectedInterview?._id) {
        await dispatch(
          updateInterview({
            id: selectedInterview._id,
            interviewData: newInterview,
          })
        ).unwrap();
        showSuccess("Interview updated successfully!");
      } else {
        await dispatch(addInterview({ ...newInterview })).unwrap();
        showSuccess("Interview added successfully!");
      }
      dispatch(hideModal());
      resetForm();
    } catch (err) {
      console.error("Error saving interview", err);
      showError(err?.message || "Failed to save interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusOrRoundUpdate = async (interviewId, updates) => {
    const currentInterview = interviews.find(
      (item) => item._id === interviewId
    );
    if (!currentInterview) {
      showError("Interview not found");
      return;
    }

    try {
      await dispatch(
        updateInterview({
          id: interviewId,
          interviewData: { ...currentInterview, ...updates },
        })
      ).unwrap();

      if (updates.round) {
        showSuccess(`Candidate moved to ${updates.round} successfully!`);
      } else if (updates.status) {
        showSuccess("Status updated successfully!");
      }
    } catch (err) {
      console.error("Error updating interview", err);
      showError(err?.message || "Failed to update interview");
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    try {
      await dispatch(deleteInterviewThunk(interviewId)).unwrap();
      showSuccess("Interview deleted successfully!");
    } catch (err) {
      console.error("Error deleting interview", err);
      showError(err?.message || "Failed to delete interview");
    }
  };

  const sendMail = async (interview) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/email/send`, {
        email: interview.email,
        candidate: interview.candidate,
        position: interview.position,
        date: interview.date,
        time: interview.time,
        meetingLink: interview.meetingLink || "https://meet.google.com/",
      });
      showSuccess("Email sent successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to send email");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <InterviewHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddInterview={() => {
          resetForm();
          dispatch(showModal());
        }}
      />

      <div className="alert alert-info">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <div>
            <h3 className="font-semibold">Interview Progression</h3>
            <p className="text-sm">
              Candidates stay in their current round table until you change
              their round. Status changes don't move candidates between tables.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>
            {typeof error === "string" ? error : "Unable to load interviews."}
          </span>
        </div>
      )}

      {showInitialLoader && (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-2">Loading interviews...</p>
        </div>
      )}

      <InterviewFilters
        sortConfig={sortConfig}
        onSort={handleSort}
        searchTerm={searchTerm}
        totalResults={totalResults}
      />

      {!showInitialLoader && (
        <>
          <InterviewTable
            interviews={firstRoundInterviews}
            title="1st Round Interviews"
            badgeColor="badge-neutral"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={secondRoundInterviews}
            title="2nd Round Interviews"
            badgeColor="badge-secondary"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={finalRoundInterviews}
            title="Final Round Interviews"
            badgeColor="badge-accent"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={pendingInterviews}
            title="Pending"
            badgeColor="badge-error"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={hiredInterviews}
            title="Hired Candidates"
            badgeColor="badge-success"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />

          <InterviewTable
            interviews={rejectedInterviews}
            title="Rejected Candidates"
            badgeColor="badge-error"
            onEdit={(interview) => dispatch(showModal(interview))}
            onDelete={handleDeleteInterview}
            onSendEmail={sendMail}
            onStatusUpdate={handleStatusOrRoundUpdate}
          />
        </>
      )}

      <InterviewModal
        showModal={modalState.show}
        editingInterview={modalState.editing ? selectedInterview : null}
        newInterview={newInterview}
        setNewInterview={setNewInterview}
        loading={isSubmitting}
        onClose={() => {
          dispatch(hideModal());
          resetForm();
        }}
        onSubmit={handleSubmitInterview}
      />
    </div>
  );
}
