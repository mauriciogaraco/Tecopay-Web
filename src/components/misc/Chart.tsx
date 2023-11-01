import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  getMaxValue,
  maxValueFromArray,
  minValueFromArray,
} from '../../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BarCharProps {
  title?: string;
  name: string;
  xlabels?: string[];
  dataShow?: number[];
}

export function BarChar({ name, xlabels, dataShow, title }: BarCharProps) {
  const data = {
    labels: xlabels,
    datasets: [
      {
        label: name,
        data: dataShow,
        backgroundColor: '#ffa600',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: title ? true : false,
        text: title,
      },
    },
  };

  return <Bar options={options} data={data} />;
}

export const LineChart = ({ name, xlabels, dataShow, title }: BarCharProps) => {
  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        type: 'linear',
        min: getMaxValue(minValueFromArray(dataShow || [0])) || 0,
        max: getMaxValue(maxValueFromArray(dataShow || [10])) || 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: xlabels,
    datasets: [
      {
        label: name,
        data: dataShow,
        borderColor: '#9CA3AF',
        backgroundColor: '#EA5E27',
      },
    ],
  };
  // @ts-ignore
  return <Line options={options} data={data} />;
};
// @ts-ignore
