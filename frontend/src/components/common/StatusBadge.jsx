import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
    completed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
    inactive: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    pending: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white animate-pulse',
    rejected: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
  };

  const statusIcons = {
    active: '✅',
    completed: '✅',
    inactive: '⏸️',
    pending: '⏳',
    rejected: '❌'
  };

  const normalizedStatus = status ? status.toLowerCase() : 'inactive';

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${statusStyles[normalizedStatus] || statusStyles.inactive}`}
    >
      {statusIcons[normalizedStatus] || '❓'} {status}
    </span>
  );
};

export default StatusBadge;