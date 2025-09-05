import React, { useState } from 'react';

const Input = ({ label, id, type = 'text', value, onChange, placeholder, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label 
        htmlFor={id} 
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isFocused || value 
            ? 'top-1 text-xs text-blue-500 font-medium' 
            : 'top-3 text-gray-500'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ''}
        className="w-full px-4 pt-5 pb-2 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0 bg-gray-50 rounded-t-lg transition-all duration-300 focus:bg-white focus:shadow-md"
        {...props}
      />
    </div>
  );
};

export default Input;