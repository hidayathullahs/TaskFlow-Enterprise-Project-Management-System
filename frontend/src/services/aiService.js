import api from '../config/axios';

export const aiService = {
  getSummary: async () => {
    const response = await api.get('/ai/summary');
    return response.data;
  },
  getProjectRisks: async () => {
    const response = await api.get('/ai/project-risk');
    return response.data;
  },
  getWorkload: async () => {
    const response = await api.get('/ai/workload');
    return response.data;
  },
  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations');
    return response.data;
  },
};
