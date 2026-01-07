'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const plotData: Array<Record<string, unknown>> = [
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

  const layout: Record<string, unknown> = {
    title: { 
      text: 'Gene Prevalence Across Hosts (%)',
      font: { size: isMobile ? 12 : isTablet ? 14 : 16 },
    },
    xaxis: { 
      title: 'Host Association',
      titlefont: { size: isMobile ? 11 : 12 },
      tickfont: { size: isMobile ? 9 : 10 },
    },
    yaxis: { 
      title: 'Gene', 
      automargin: true,
      titlefont: { size: isMobile ? 11 : 12 },
      tickfont: { size: isMobile ? 8 : 9 },
    },
    height: isMobile 
      ? Math.max(400, sortedGenes.length * 15)
      : isTablet
      ? Math.max(450, sortedGenes.length * 18)
      : Math.max(400, sortedGenes.length * 20),
    margin: { 
      l: isMobile ? 80 : isTablet ? 100 : 150, 
      r: isMobile ? 20 : 50, 
      t: isMobile ? 60 : 50, 
      b: isMobile ? 80 : 100 
    },
    font: { size: isMobile ? 10 : 12 },
  };

  const config: Record<string, unknown> = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
  };

  return (
    <div className="w-full">
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%' }}
        onClick={(event: Record<string, unknown>) => {
          if (onGeneClick && event.points && Array.isArray(event.points) && event.points[0]) {
            const point = event.points[0] as Record<string, unknown>;
            const geneIndex = point.y as number;
            onGeneClick(sortedGenes[geneIndex]);
          }
        }}
      />
    </div>
  );
}

