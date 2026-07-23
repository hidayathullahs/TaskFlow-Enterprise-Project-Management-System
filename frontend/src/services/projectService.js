import api from '../config/axios';

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (publicId) => {
    const response = await api.get(`/projects/${publicId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  update: async (publicId, data) => {
    const response = await api.put(`/projects/${publicId}`, data);
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/projects/${publicId}`);
    return response.data;
  },
  getMembers: async (publicId) => {
    const response = await api.get(`/projects/${publicId}/members`);
    return response.data;
  },
  addMember: async (publicId, data) => {
    const response = await api.post(`/projects/${publicId}/members`, data);
    return response.data;
  },
  removeMember: async (publicId, userId) => {
    const response = await api.delete(`/projects/${publicId}/members/${userId}`);
    return response.data;
  },
  getMilestones: async (publicId) => {
    const response = await api.get(`/projects/${publicId}/milestones`);
    return response.data;
  },
  createMilestone: async (publicId, data) => {
    const response = await api.post(`/projects/${publicId}/milestones`, data);
    return response.data;
  },
  getAnalytics: async (publicId) => {
    const response = await api.get(`/projects/${publicId}/analytics`);
    return response.data;
  },
  search: async (params) => {
    const response = await api.get('/projects/search', { params });
    return response.data;
  },
};
