import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Sobre Nosotros</h1>
        <p className="text-gray-700 mb-4">
          En <strong>GymPower</strong> nos dedicamos a transformar vidas a través del
          entrenamiento físico, el bienestar y la comunidad.
        </p>
        <p className="text-gray-600">
          Contamos con entrenadores certificados, equipos de última generación y
          programas adaptados a todos los niveles.
        </p>
      </div>
    </div>
  );
}
