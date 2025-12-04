'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';

// Use Plotly for heatmap
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface HeatmapProps {
  onGeneClick?: (geneName: string) => void;
}

/**
 * Heatmap visualization showing gene prevalence across different host associations.
 * Rows represent genes (sorted alphabetically), columns represent hosts.
 * Cell values show prevalence percentage (0-100).
 */
export default function Heatmap({ onGeneClick }: HeatmapProps) {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading heatmap...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
  }

  // Get all unique genes and sort alphabetically
  const allGenes = new Set<string>();
  Object.values(data.hostPrevalence).forEach(hostData => {
    Object.keys(hostData).forEach(gene => allGenes.add(gene));
  });
  const sortedGenes = Array.from(allGenes).sort();

  // Host categories in order
  const hostCategories = ['Poultry', 'Cattle', 'Swine', 'Human', 'Multiple', 'Other'];
  const availableHosts = hostCategories.filter(host => data.hostPrevalence[host]);

  // Build data matrix
  const z: number[][] = sortedGenes.map(gene => 
    availableHosts.map(host => data.hostPrevalence[host]?.[gene] || 0)
  );

  const plotData: any[] = [
    {
      z,
      x: availableHosts,
      y: sortedGenes,
      type: 'heatmap',
      colorscale: 'Viridis',
      hoverongaps: false,
      hovertemplate: '<b>%{y}</b><br>Host: %{x}<br>Prevalence: %{z}%<extra></extra>',
    },
  ];

  const layout: any = {
    title: { text: 'Gene Prevalence Across Hosts (%)' },
    xaxis: { title: 'Host Association' },
    yaxis: { title: 'Gene', automargin: true },
    height: Math.max(400, sortedGenes.length * 20),
    margin: { l: 150, r: 50, t: 50, b: 100 },
  };

  const config: any = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'] as any,
  };

  return (
    <div className="w-full">
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%' }}
        onClick={(event: any) => {
          if (onGeneClick && event.points && event.points[0]) {
            const geneIndex = event.points[0].y;
            onGeneClick(sortedGenes[geneIndex]);
          }
        }}
      />
    </div>
  );
}

