'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';

// Use Plotly for Sankey diagram
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SankeyProps {
  topK?: number;
  onGeneClick?: (geneName: string) => void;
}

/**
 * Sankey diagram showing flow from Host categories to top K genes.
 * Link values represent counts (how many isolates for that host contain that gene).
 */
export default function Sankey({ topK = 20, onGeneClick }: SankeyProps) {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading Sankey diagram...</div>;
  }

  if (error || !data || !data.sankeyData) {
    return <div className="text-center py-8 text-red-600">Error: {error || 'No data available'}</div>;
  }

  const { nodes, links } = data.sankeyData;

  if (nodes.length === 0 || links.length === 0) {
    return <div className="text-center py-8 text-gray-600">No Sankey data available</div>;
  }

  // Recompute with topK if different
  const plotData: any[] = [
    {
      type: 'sankey',
      orientation: 'h',
      node: {
        pad: 15,
        thickness: 20,
        line: {
          color: 'black',
          width: 0.5,
        },
        label: nodes.map((n: any) => n.label),
        color: nodes.map((n: any, idx: number) => {
          // Color hosts differently from genes
          const hostCount = Object.keys(data.hostStats).length;
          return idx < hostCount ? '#636efa' : '#ef553b';
        }),
      },
      link: {
        source: links.map((l: any) => l.source),
        target: links.map((l: any) => l.target),
        value: links.map((l: any) => l.value),
        color: links.map((l: any) => {
          // Color links based on source (host)
          return 'rgba(99, 110, 250, 0.4)';
        }),
        hovertemplate: 'Host: %{source.label}<br>Gene: %{target.label}<br>Count: %{value}<extra></extra>',
      },
    },
  ];

  const layout = {
    title: `Host → Gene Flow (Top ${topK} Genes)`,
    font: { size: 12 },
    height: 600,
    margin: { l: 50, r: 50, t: 50, b: 50 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
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
            const point = event.points[0];
            // If clicked on a target node (gene), extract gene name
            if (point.curveNumber === 0 && point.pointNumber !== undefined) {
              const nodeIndex = plotData[0].link.target[point.pointNumber];
              const geneName = nodes[nodeIndex]?.label;
              if (geneName && !data.hostStats[geneName]) {
                // It's a gene, not a host
                onGeneClick(geneName);
              }
            }
          }
        }}
      />
    </div>
  );
}

