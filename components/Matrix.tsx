'use client';

import { useData } from './DataProvider';

export default function Matrix() {
  const { data, loading, error } = useData();

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading matrix data...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-8 text-red-600">Error: {error || 'No data available'}</div>;
  }

  const matrix = data.speciesMatrix;
  const genes = Object.keys(matrix).sort();

  if (genes.length === 0) {
    return <div className="text-center py-8 text-gray-600">No gene data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Gene</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">C. jejuni</th>
            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">C. coli</th>
          </tr>
        </thead>
        <tbody>
          {genes.map((gene, index) => {
            const presence = matrix[gene];
            return (
              <tr key={gene} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{gene}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span
                    className={`inline-block w-6 h-6 rounded ${
                      presence.jejuni ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={presence.jejuni ? 'Present' : 'Absent'}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span
                    className={`inline-block w-6 h-6 rounded ${
                      presence.coli ? 'bg-green-500' : 'bg-gray-300'
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
  );
}

