import api from '../config/axios';

export const departmentService = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },
  getById: async (publicId) => {
    const response = await api.get(`/departments/${publicId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/departments', data);
    return response.data;
  },
  update: async (publicId, data) => {
    const response = await api.put(`/departments/${publicId}`, data);
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/departments/${publicId}`);
    return response.data;
  },
};
