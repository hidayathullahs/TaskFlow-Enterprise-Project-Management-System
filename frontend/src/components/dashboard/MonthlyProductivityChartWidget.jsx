import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../common/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MonthlyProductivityChartWidget = ({ data }) => {
  const chartData = {
    labels: data ? Object.keys(data) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: data ? Object.values(data) : [42, 58, 74, 89, 112, 135, 148],
        backgroundColor: '#2563EB',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [4, 4] } },
    },
  };

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Monthly Team Productivity</h3>}>
      <div className="h-64 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};
