import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        {/* Encabezado con título y botón de cierre */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Contenido del modal */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;