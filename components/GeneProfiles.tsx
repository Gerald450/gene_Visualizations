'use client';

import { useState } from 'react';
import { useData } from './DataProvider';

export default function GeneProfiles() {
  const { data, loading, error } = useData();
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading gene profiles...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
  }

  const processes = data.processes;
  const processOrder = ['adhesion', 'invasion', 'mobility', 'toxin', 'colonization', 'survival', 'other'];

  const sortedProcesses = processOrder
    .filter(p => processes[p] && processes[p].length > 0)
    .concat(Object.keys(processes).filter(p => !processOrder.includes(p)));

  return (
    <div className="space-y-4">
      {sortedProcesses.map(processName => {
        const genes = processes[processName] || [];
        const isExpanded = expandedProcess === processName;

        return (
          <details
            key={processName}
            open={isExpanded}
            onToggle={(e) => {
              setExpandedProcess((e.target as HTMLDetailsElement).open ? processName : null);
            }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <summary className="px-4 py-3 bg-gray-100 dark:bg-gray-800 cursor-pointer font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-900 dark:text-gray-100">
              {processName.charAt(0).toUpperCase() + processName.slice(1)} ({genes.length} genes)
            </summary>
            <div className="px-4 py-3 bg-white dark:bg-gray-900">
              <div className="flex flex-wrap gap-2">
                {genes.map(gene => {
                  const geneData = data.genes.find(g => g.geneName === gene);
                  return (
                    <div
                      key={gene}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-sm"
                      title={geneData?.function || ''}
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">{gene}</span>
                      {geneData?.cluster && (
                        <span className="text-gray-600 dark:text-gray-400 ml-1">({geneData.cluster})</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}

