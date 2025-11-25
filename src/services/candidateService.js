import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const candidateService = {
  // Get all candidates
  async getAllCandidates() {
    const response = await api.get('/candidates');
    return response;
  },

  // Get candidate by ID
  async getCandidateById(id) {
    const response = await api.get(`/candidates/${id}`);
    return response;
  },

  // Create new candidate
  async createCandidate(candidateData) {
    const response = await api.post('/candidates', candidateData);
    return response;
  },

  // Update candidate
  async updateCandidate(id, candidateData) {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response;
  },

  // Delete candidate
  async deleteCandidate(id) {
    const response = await api.delete(`/candidates/${id}`);
    return response;
  },

  
  async updateCandidateStatus(id, status) {
    const response = await api.patch(`/candidates/${id}/status`, { status });
    return response;
  },

  async getCandidatesByStatus(status) {
    const response = await api.get(`/candidates/status/${status}`);
    return response;
  },

  async searchCandidates(query) {
    const response = await api.get(`/candidates/search?q=${query}`);
    return response;
  },

 
  async uploadResume(id, formData) {
    const response = await api.post(`/candidates/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

 
  async getCandidateAnalytics() {
    const response = await api.get('/candidates/analytics');
    return response;
  }
};

export default candidateService;