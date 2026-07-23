import api from '../config/axios';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getCharts: async () => {
    const response = await api.get('/dashboard/charts');
    return response.data;
  },
  getActivities: async () => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  },
};
