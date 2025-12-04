'use client';

import { useData } from './DataProvider';

export default function Matrix() {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading matrix data...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">Error: {error || 'No data available'}</div>;
  }

  const matrix = data.speciesMatrix;
  const genes = Object.keys(matrix).sort();

  if (genes.length === 0) {
    return <div className="text-center py-8 text-gray-600 dark:text-gray-400">No gene data available</div>;
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">Gene</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-center font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">C. jejuni</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-center font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">C. coli</th>
            </tr>
          </thead>
          <tbody>
            {genes.map((gene, index) => {
              const presence = matrix[gene];
              return (
                <tr key={gene} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">{gene}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-center">
                    <span
                      className={`inline-block w-5 h-5 sm:w-6 sm:h-6 rounded ${
                        presence.jejuni ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      title={presence.jejuni ? 'Present' : 'Absent'}
                    />
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 text-center">
                    <span
                      className={`inline-block w-5 h-5 sm:w-6 sm:h-6 rounded ${
                        presence.coli ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      title={presence.coli ? 'Present' : 'Absent'}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

