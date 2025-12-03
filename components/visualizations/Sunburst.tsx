'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';

// Use Plotly for sunburst
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SunburstProps {
  onSectorClick?: (path: string[]) => void;
}

/**
 * Sunburst diagram showing hierarchy: All isolates → Species → Host → Gene count
 */
export default function Sunburst({ onSectorClick }: SunburstProps) {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading sunburst...</div>;
  }

  if (error || !data || !data.sunburstHierarchy) {
    return <div className="text-center py-8 text-red-600">Error: {error || 'No data available'}</div>;
  }

  // Convert hierarchy to Plotly sunburst format
  const buildSunburstData = (node: any, parent: string = ''): { ids: string[]; labels: string[]; parents: string[]; values: number[] } => {
    const result = { ids: [] as string[], labels: [] as string[], parents: [] as string[], values: [] as number[] };
    
    const processNode = (n: any, p: string = '') => {
      const id = p ? `${p}|${n.name}` : n.name;
      
      result.ids.push(id);
      result.labels.push(n.name);
      result.parents.push(p);
      result.values.push(n.value || 0);
      
      if (n.children && n.children.length > 0) {
        n.children.forEach((child: any) => processNode(child, id));
      }
    };
    
    processNode(node, parent);
    return result;
  };

  const sunburstData = buildSunburstData(data.sunburstHierarchy);

  const plotData: any[] = [
    {
      type: 'sunburst',
      ...sunburstData,
      marker: {
        line: { width: 2 },
      },
      hovertemplate: '<b>%{label}</b><br>Count: %{value}<extra></extra>',
    },
  ];

  const layout = {
    title: 'Species → Host → Gene Count Hierarchy',
    margin: { l: 0, r: 0, t: 50, b: 0 },
    sunburstcolorway: ['#636efa', '#ef553b', '#00cc96', '#ab63fa', '#ffa15a', '#19d3f3'],
    extendsunburstcolors: true,
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
        style={{ width: '100%', height: '600px' }}
        onClick={(event: any) => {
          if (onSectorClick && event.points && event.points[0]) {
            const path = event.points[0].id.split('|');
            onSectorClick(path);
          }
        }}
      />
    </div>
  );
}

