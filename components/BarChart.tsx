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
import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading chart data...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
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
        labels: {
          font: {
            size: isMobile ? 11 : 12,
          },
          boxWidth: isMobile ? 12 : 12,
        },
      },
      title: {
        display: true,
        text: 'Gene Prevalence by Host Association (%)',
        font: {
          size: isMobile ? 14 : 16,
        },
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
          font: {
            size: isMobile ? 12 : 14,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Gene/Cluster',
          font: {
            size: isMobile ? 12 : 14,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 12,
          },
          maxRotation: isMobile ? 90 : 0,
          minRotation: isMobile ? 45 : 0,
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: isMobile ? '350px' : '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

