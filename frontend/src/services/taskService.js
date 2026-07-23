import api from '../config/axios';

export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  getById: async (publicId) => {
    const response = await api.get(`/tasks/${publicId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },
  update: async (publicId, data) => {
    const response = await api.put(`/tasks/${publicId}`, data);
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/tasks/${publicId}`);
    return response.data;
  },
  moveStatus: async (publicId, newStatus) => {
    const response = await api.put(`/tasks/${publicId}/move`, { newStatus });
    return response.data;
  },
  getKanbanBoard: async (projectPublicId) => {
    const response = await api.get('/tasks/kanban', { params: { projectPublicId } });
    return response.data;
  },
  addComment: async (publicId, content) => {
    const response = await api.post(`/tasks/${publicId}/comments`, { content });
    return response.data;
  },
  getComments: async (publicId) => {
    const response = await api.get(`/tasks/${publicId}/comments`);
    return response.data;
  },
  search: async (params) => {
    const response = await api.get('/tasks/search', { params });
    return response.data;
  },
};
