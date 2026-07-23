import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from '../common/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ProjectStatusChartWidget = ({ data }) => {
  const chartData = {
    labels: data ? Object.keys(data) : ['PLANNING', 'IN_PROGRESS', 'COMPLETED'],
    datasets: [
      {
        data: data ? Object.values(data) : [2, 5, 3],
        backgroundColor: ['#60A5FA', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'Inter' },
        },
      },
    },
  };

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Status Distribution</h3>}>
      <div className="h-64 w-full">
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
};
