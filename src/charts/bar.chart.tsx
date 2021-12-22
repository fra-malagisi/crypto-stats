import { ChartData } from 'chart.js';
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';
import { ChartProps } from 'types';

export const BarChart = ({ data, labels }: ChartProps) => {
  const formatData = (data: number[]): ChartData => ({
    labels,
    datasets: [{ data, backgroundColor: data.map((el) => (el > 0 ? 'rgba(75, 192, 192)' : 'rgba(255, 99, 132)')) }],
  });
  const chartRef = useRef<Chart | null>(null);
  const canvasCallback = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: formatData(data),
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'PNL' } },
        },
      });
    }
  };

  // effect to update the chart when props are updated
  useEffect(() => {
    // must verify that the chart exists
    const chart = chartRef.current;
    if (chart) {
      chart.data = formatData(data);
      chart.update();
    }
  }, [data]);

  return (
    <div className="w-1/2 border rounded shadow">
      <canvas ref={canvasCallback} id="myChart" width="200" height="200"></canvas>
    </div>
  );
};
