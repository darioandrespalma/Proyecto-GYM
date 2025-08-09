import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Contacto</h1>
        <p className="text-gray-700 mb-6">
          ¿Tienes dudas o quieres más información? Envíanos un mensaje.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full border rounded-lg p-3"
          />
          <input
            type="email"
            placeholder="Tu correo"
            className="w-full border rounded-lg p-3"
          />
          <textarea
            placeholder="Tu mensaje"
            className="w-full border rounded-lg p-3"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
