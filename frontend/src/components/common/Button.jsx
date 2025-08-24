import React from 'react';

const Button = ({ children, onClick, type = 'button', color = 'primary', className = '' }) => {
  const baseClasses = 'px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors';

  const colorClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${colorClasses[color]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;