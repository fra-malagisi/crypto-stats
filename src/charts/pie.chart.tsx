import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartProps } from 'types';

export const PieChart = ({ labels, colors, data }: ChartProps): JSX.Element => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const config = {
    labels,
    datasets: [
      {
        label: '# of Votes',
        data: data,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-96 max-h-100 border rounded shadow">
      <Pie data={config} />
    </div>
  );
};
