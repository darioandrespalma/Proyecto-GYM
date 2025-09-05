// Table.jsx mejorado
import React from 'react';

const Table = ({ columns, data, className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500">No hay datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-2xl shadow-sm ${className}`}>
      <table className="min-w-full bg-white">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.accessor} 
                className="text-left py-4 px-6 uppercase font-semibold text-sm text-gray-700 border-b border-gray-200"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="transition-colors duration-200 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td 
                  key={col.accessor} 
                  className="py-4 px-6 text-gray-700"
                >
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;