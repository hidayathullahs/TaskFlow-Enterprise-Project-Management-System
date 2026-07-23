import api from '../config/axios';

export const fileService = {
  uploadFile: async (formData) => {
    const response = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getFileUrl: (publicId) => `/api/v1/files/${publicId}`,
  deleteFile: async (publicId) => {
    const response = await api.delete(`/files/${publicId}`);
    return response.data;
  },
};
