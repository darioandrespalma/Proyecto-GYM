import React from 'react';

const Card = ({ children, className = '', hoverable = false }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ${hoverable ? 'hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;