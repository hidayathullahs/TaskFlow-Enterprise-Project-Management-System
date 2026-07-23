import api from '../config/axios';

export const teamService = {
  getAll: async () => {
    const response = await api.get('/teams');
    return response.data;
  },
  getById: async (publicId) => {
    const response = await api.get(`/teams/${publicId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/teams', data);
    return response.data;
  },
  update: async (publicId, data) => {
    const response = await api.put(`/teams/${publicId}`, data);
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/teams/${publicId}`);
    return response.data;
  },
};
