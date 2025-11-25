import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const dashboardService = {
  async getOverview() {
    const response = await api.get('/dashboard/overview');
    return response;
  },
};

export default dashboardService;

