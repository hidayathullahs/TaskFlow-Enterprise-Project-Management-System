import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card } from '../common/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

export const TaskPriorityChartWidget = ({ data }) => {
  const chartData = {
    labels: data ? Object.keys(data) : ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    datasets: [
      {
        data: data ? Object.values(data) : [10, 25, 15, 5],
        backgroundColor: ['#94A3B8', '#3B82F6', '#F59E0B', '#EF4444'],
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
        labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } },
      },
    },
  };

  return (
    <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Task Priority Breakdown</h3>}>
      <div className="h-64 w-full">
        <Pie data={chartData} options={options} />
      </div>
    </Card>
  );
};
