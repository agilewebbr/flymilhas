// src/components/dashboard/ClientsChart.tsx
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ClientsChartProps {
  data: Array<{ month: string; count: number }>
}

export function ClientsChart({ data }: ClientsChartProps) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Clientes Cadastrados',
        data: data.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Evolução de Clientes (Últimos 6 Meses)',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold' as const, // ← FIX: Usar 'bold' em vez de '600'
        },
        color: '#111827',
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
          color: '#6b7280',
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
          color: '#6b7280',
        },
        grid: {
          color: '#f3f4f6',
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}