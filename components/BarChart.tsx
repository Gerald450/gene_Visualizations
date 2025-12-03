'use client';

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
import { useData } from './DataProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart() {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading chart data...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600">Error: {error || 'No data available'}</div>;
  }

  // Extract major genes/clusters (cdtA, cdtB, cdtC, cadF, ciaB, flaA, etc.)
  const majorGenes = ['cdtA', 'cdtB', 'cdtC', 'cadF', 'ciaB', 'flaA'];
  
  // Get all unique genes from hostStats
  const allGenes = new Set<string>();
  Object.values(data.hostStats).forEach(hostData => {
    Object.keys(hostData.genes || {}).forEach(gene => allGenes.add(gene));
  });

  // Combine major genes with other genes found in data
  const genesToDisplay = Array.from(allGenes).filter(gene => 
    majorGenes.some(mg => gene.toLowerCase().includes(mg.toLowerCase())) || 
    majorGenes.includes(gene)
  );

  if (genesToDisplay.length === 0) {
    // Fallback: use first 10 genes if major genes not found
    genesToDisplay.push(...Array.from(allGenes).slice(0, 10));
  }

  // Host categories
  const hostCategories = ['Poultry', 'Cattle', 'Swine', 'Human', 'Multiple'];
  const availableHosts = hostCategories.filter(host => data.hostStats[host]);

  // Prepare chart data
  const datasets = availableHosts.map((host, index) => {
    const hostData = data.hostStats[host];
    const backgroundColor = `hsl(${(index * 360) / availableHosts.length}, 70%, 60%)`;
    
    return {
      label: host,
      data: genesToDisplay.map(gene => hostData.genes[gene] || 0),
      backgroundColor,
    };
  });

  const chartData = {
    labels: genesToDisplay,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gene Prevalence by Host Association (%)',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Prevalence (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Gene/Cluster',
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

