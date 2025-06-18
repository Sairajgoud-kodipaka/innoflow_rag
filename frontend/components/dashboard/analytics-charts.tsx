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
  analytics?: any;
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  // Fallback data if analytics is not provided
  const fallbackData = {
    executionsByDate: [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 5 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 8 },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 12 },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 7 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 15 },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 10 },
      { date: new Date().toISOString().split('T')[0], count: 18 }
    ],
    executionsByStatus: {
      pending: 3,
      running: 2,
      completed: 45,
      failed: 5
    }
  };

  const data = analytics || fallbackData;

  const executionsByDateData = {
    labels: data?.executionsByDate?.map((item: any) => item.date) || [],
    datasets: [
      {
        label: 'Executions',
        data: data?.executionsByDate?.map((item: any) => item.count) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
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
          data?.executionsByStatus?.pending || 0,
          data?.executionsByStatus?.running || 0,
          data?.executionsByStatus?.completed || 0,
          data?.executionsByStatus?.failed || 0,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgb(255, 206, 86)',
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Executions Over Time</h3>
        <div className="h-64">
          <Line
            data={executionsByDateData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    color: 'white'
                  }
                },
              },
              scales: {
                x: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
              }
            }}
          />
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Executions by Status</h3>
        <div className="h-64">
          <Bar
            data={executionsByStatusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    color: 'white'
                  }
                },
              },
              scales: {
                x: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                  ticks: { color: 'white' },
                  grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 