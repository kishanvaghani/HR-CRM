export const CONSTANT = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  SUBMIT: "Submit",
  CANCEL: "Cancel",
  DELETE: "Delete",
  UPDATE: "Update",
  SAVE: "Save",
  SEARCH: "Search",
};

export const LABELS = {
  CANDIDATE_NAME: "Candidate Name",
  EMAIL: "Email",
  PHONE: "Phone",
  INTERVIEW_DATE: "Interview Date",
  INTERVIEW_TIME: "Interview Time",
  INTERVIEWER: "Interviewer",
  ROLE: "Role",
  STATUS: "Status",
};

export const MESSAGES = {
  INTERVIEW_CREATED: "Interview scheduled successfully.",
  INTERVIEW_UPDATED: "Interview updated successfully.",
  INTERVIEW_DELETED: "Interview deleted successfully.",
  ERROR_OCCURRED: "Something went wrong. Please try again.",
  DELETE_CONFIRM: "Are you sure you want to delete this interview?",
};

export const INTERVIEW_ROUNDS = {
  PENDING: "Pending",
  FIRSTROUND: "1st Round",
  SECONDROUND: "2nd Round",
  FINALROUND: "Final Round",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

export const INTERVIEW_ROUND_LIST = Object.values(INTERVIEW_ROUNDS);

export const INTERVIEW_STATUS = {
  NOT_JOINED: "Not Joined",
  LACK_OF_KNOWLEDGE: "Lack of Knowledge",
  SECOND_ROUND_REQUIRED: "Need to do 2nd Round",
  OFFER_SENT: "Offer Sent",
  OFFER_ACCEPTED: "Offer Accepted",
  OFFER_DECLINED: "Offer Declined",
  MISMATCH_REQUIREMENT: "Mismatch Requirement",
  BACKEND_HEAVY: "Backend Heavy",
  Missed: "Missed",
  CHEATING: "Cheating",
  LACK_OF_CONFIDENCE: "Lack of Confidence",
  LACK_OF_COMMUNICATION: "Lack of Communication",
  MEDICAL_EMERGENCY: "Medical Emergency",
};

export const INTERVIEW_STATUS_LIST = Object.values(INTERVIEW_STATUS);
export const getAvatarInitial = (name) => {
  if (name === null || name === undefined) return "?";

  // If it's a number or numeric string (e.g. "10", "25")
  if (!isNaN(name)) {
    return String(name);
  }

  if (typeof name !== "string") return "?";

  return name.trim().charAt(0).toUpperCase() || "?";
};
