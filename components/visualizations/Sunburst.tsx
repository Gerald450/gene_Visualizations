'use client';

import { useData } from '../DataProvider';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

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
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading sunburst...</div>;
  }

  if (error || !data || !data.sunburstHierarchy) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
  }

  // Convert hierarchy to Plotly sunburst format
  const buildSunburstData = (node: Record<string, unknown>, parent: string = ''): { ids: string[]; labels: string[]; parents: string[]; values: number[] } => {
    const result = { ids: [] as string[], labels: [] as string[], parents: [] as string[], values: [] as number[] };
    
    const processNode = (n: Record<string, unknown>, p: string = '') => {
      const name = n.name as string;
      const id = p ? `${p}|${name}` : name;
      
      result.ids.push(id);
      result.labels.push(name);
      result.parents.push(p);
      result.values.push((n.value as number) || 0);
      
      if (n.children && Array.isArray(n.children)) {
        (n.children as Array<Record<string, unknown>>).forEach((child: Record<string, unknown>) => processNode(child, id));
      }
    };
    
    processNode(node, parent);
    return result;
  };

  const sunburstData = buildSunburstData(data.sunburstHierarchy as Record<string, unknown>);

  const plotData: Array<Record<string, unknown>> = [
    {
      type: 'sunburst',
      ...sunburstData,
      marker: {
        line: { width: 2 },
      },
      hovertemplate: '<b>%{label}</b><br>Count: %{value}<extra></extra>',
    },
  ];

  const layout: Record<string, unknown> = {
    title: { 
      text: 'Species → Host → Gene Count Hierarchy',
      font: { size: isMobile ? 12 : isTablet ? 14 : 16 },
    },
    margin: { 
      l: 0, 
      r: 0, 
      t: isMobile ? 60 : 50, 
      b: 0 
    },
    sunburstcolorway: ['#636efa', '#ef553b', '#00cc96', '#ab63fa', '#ffa15a', '#19d3f3'],
    extendsunburstcolors: true,
  };

  const config: Record<string, unknown> = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className="w-full">
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%', height: isMobile ? '450px' : isTablet ? '550px' : '600px' }}
        onClick={(event: Record<string, unknown>) => {
          if (onSectorClick && event.points && Array.isArray(event.points) && event.points[0]) {
            const point = event.points[0] as Record<string, unknown>;
            const id = point.id as string;
            const path = id.split('|');
            onSectorClick(path);
          }
        }}
      />
    </div>
  );
}

