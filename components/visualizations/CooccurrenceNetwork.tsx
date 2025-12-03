'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Use react-force-graph for network visualization
const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { 
  ssr: false 
});

interface CooccurrenceNetworkProps {
  onNodeClick?: (geneName: string) => void;
}

/**
 * Network graph showing co-occurrence relationships between genes.
 * Nodes represent genes (size proportional to total occurrences).
 * Links represent co-occurrence (thickness proportional to co-occurrence count).
 */
export default function CooccurrenceNetwork({ onNodeClick }: CooccurrenceNetworkProps) {
  const { data, loading, error } = useData();

  const graphData = useMemo(() => {
    if (!data || !data.cooccurrence) {
      return { nodes: [], links: [] };
    }

    const { nodes, links } = data.cooccurrence;

    // Calculate max counts for normalization
    const maxNodeCount = Math.max(...nodes.map(n => n.count), 1);
    const maxLinkCount = Math.max(...links.map(l => l.count), 1);

    return {
      nodes: nodes.map(node => ({
        id: node.id,
        name: node.id,
        value: node.count,
        // Size proportional to count
        size: Math.sqrt(node.count / maxNodeCount) * 10 + 3,
      })),
      links: links.map(link => ({
        source: link.source,
        target: link.target,
        value: link.count,
        // Thickness proportional to co-occurrence count
        width: (link.count / maxLinkCount) * 3 + 1,
      })),
    };
  }, [data]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading network graph...</div>;
  }

  if (error || !data || !data.cooccurrence) {
    return <div className="text-center py-8 text-red-600">Error: {error || 'No data available'}</div>;
  }

  if (graphData.nodes.length === 0) {
    return <div className="text-center py-8 text-gray-600">No co-occurrence data available</div>;
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => {
          const geneData = data.genes.find(g => g.geneName === node.id);
          return `${node.id}<br>Occurrences: ${node.value}<br>Function: ${geneData?.function || 'Unknown'}`;
        }}
        nodeColor={(node: any) => {
          // Color based on function category if available
          const geneData = data.genes.find(g => g.geneName === node.id);
          if (!geneData) return '#888';
          const func = geneData.function.toLowerCase();
          if (func.includes('toxin')) return '#ef4444';
          if (func.includes('adhesion')) return '#3b82f6';
          if (func.includes('invasion')) return '#10b981';
          if (func.includes('motility') || func.includes('mobility')) return '#f59e0b';
          return '#6b7280';
        }}
        linkWidth={(link: any) => link.width}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node: any) => {
          if (onNodeClick) {
            onNodeClick(node.id);
          }
        }}
        width={800}
        height={600}
      />
    </div>
  );
}

