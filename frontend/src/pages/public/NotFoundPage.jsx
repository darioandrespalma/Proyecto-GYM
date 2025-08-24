import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-4">
            <div className="bg-white p-10 rounded-lg shadow-xl flex flex-col items-center">
                <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mb-4" />
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-2">Página No Encontrada</h2>
                <p className="text-gray-500 mt-2 max-w-sm">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <Link
                    to="/login"
                    className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Volver a la página de inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;