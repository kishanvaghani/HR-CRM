import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const interviewService = {
  async getAllInterviews() {
    const response = await api.get("/interviews");
    return response;
  },

  async getInterviewById(id) {
    const response = await api.get(`/interviews/${id}`);
    return response;
  },

  async createInterview(interviewData) {
    const response = await api.post("/interviews", interviewData);
    return response;
  },

  async updateInterview(id, interviewData) {
    const response = await api.put(`/interviews/${id}`, interviewData);
    return response;
  },

  async deleteInterview(id) {
    const response = await api.delete(`/interviews/${id}`);
    return response;
  },

  async getInterviewsByStatus(status) {
    const response = await api.get(`/interviews/status/${status}`);
    return response;
  },

  async getInterviewsByRound(round) {
    const response = await api.get(`/interviews/round/${round}`);
    return response;
  },
};

export default interviewService;
