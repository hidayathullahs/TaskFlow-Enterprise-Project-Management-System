import api from '../config/axios';

export const userService = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  getById: async (publicId) => {
    const response = await api.get(`/employees/${publicId}`);
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/employees/${publicId}`);
    return response.data;
  },
  searchDirectory: async (params) => {
    const response = await api.get('/employee-directory', { params });
    return response.data;
  },
  getOrganizationHierarchy: async () => {
    const response = await api.get('/organization');
    return response.data;
  },
};
