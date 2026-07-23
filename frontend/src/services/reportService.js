import api from '../config/axios';

export const reportService = {
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
  downloadExcel: async () => {
    const response = await api.get('/reports/export/excel', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projects_portfolio.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadPdf: async () => {
    const response = await api.get('/reports/export/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projects_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadCsv: async () => {
    const response = await api.get('/reports/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_directory.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
