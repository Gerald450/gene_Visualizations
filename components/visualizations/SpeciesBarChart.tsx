'use client';

import { useData } from '../DataProvider';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SpeciesBarChartProps {
  topN?: number;
  showPercent?: boolean;
}

/**
 * Bar chart comparing gene counts/percentages between C. jejuni and C. coli.
 * X-axis: gene names (limited to top N genes)
 * Y-axis: counts or percentages
 */
export default function SpeciesBarChart({ topN = 20, showPercent = false }: SpeciesBarChartProps) {
  const { data, loading, error, getTopGenes } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading chart...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
  }

  // Get top N genes or all genes if fewer than N
  const selectedGenes = getTopGenes(topN);
  if (selectedGenes.length === 0) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">No gene data available</div>;
  }

  // Count genes by species - count occurrences in each species
  const jejuniCounts: number[] = [];
  const coliCounts: number[] = [];
  let totalJejuni = 0;
  let totalColi = 0;

  selectedGenes.forEach(gene => {
    let jejuniCount = 0;
    let coliCount = 0;

    // Count occurrences of this gene in each species
    data.genes.forEach(g => {
      if (g.geneName === gene) {
        if (g.species.includes('jejuni')) jejuniCount++;
        if (g.species.includes('coli')) coliCount++;
      }
    });

    jejuniCounts.push(jejuniCount);
    coliCounts.push(coliCount);
    totalJejuni += jejuniCount;
    totalColi += coliCount;
  });

  // Convert to percentages if requested
  const jejuniData = showPercent && totalJejuni > 0
    ? jejuniCounts.map(count => Math.round((count / totalJejuni) * 100 * 100) / 100)
    : jejuniCounts;

  const coliData = showPercent && totalColi > 0
    ? coliCounts.map(count => Math.round((count / totalColi) * 100 * 100) / 100)
    : coliCounts;

  const chartData = {
    labels: selectedGenes,
    datasets: [
      {
        label: 'C. jejuni',
        data: jejuniData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'C. coli',
        data: coliData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
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
        text: showPercent 
          ? 'Gene Distribution by Species (%)' 
          : 'Gene Counts by Species',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}${showPercent ? '%' : ''}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: showPercent ? 'Percentage (%)' : 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Gene',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

