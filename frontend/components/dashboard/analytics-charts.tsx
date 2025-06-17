import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsChartsProps {
  analytics: any;
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  const executionsByDateData = {
    labels: analytics?.executionsByDate?.map((item: any) => item.date) || [],
    datasets: [
      {
        label: 'Executions',
        data: analytics?.executionsByDate?.map((item: any) => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const executionsByStatusData = {
    labels: ['Pending', 'Running', 'Completed', 'Failed'],
    datasets: [
      {
        label: 'Executions by Status',
        data: [
          analytics?.executionsByStatus?.pending || 0,
          analytics?.executionsByStatus?.running || 0,
          analytics?.executionsByStatus?.completed || 0,
          analytics?.executionsByStatus?.failed || 0,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgb(255, 206, 86)',
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Executions Over Time</h3>
        <Line
          data={executionsByDateData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Executions by Status</h3>
        <Bar
          data={executionsByStatusData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
} 