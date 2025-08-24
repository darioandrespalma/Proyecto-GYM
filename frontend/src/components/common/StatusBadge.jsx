import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  };

  // Normaliza el texto para que coincida con las claves (ej: "Completed" -> "completed")
  const normalizedStatus = status ? status.toLowerCase() : 'inactive';

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[normalizedStatus] || statusStyles.inactive}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;