import React from 'react';

const Table = ({ columns, data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No hay datos para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="text-left py-3 px-4 uppercase font-semibold text-sm">
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col.accessor} className="py-3 px-4">
                  {/* --- CAMBIO CLAVE AQUÍ --- */}
                  {/* Ahora pasamos el objeto 'row' completo, no solo el 'value' */}
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