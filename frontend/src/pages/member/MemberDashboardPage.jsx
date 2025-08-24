import React from 'react';

const MemberDashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Panel</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <p>Bienvenido a tu panel de miembro. Aquí podrás ver el estado de tu membresía, tus próximas clases y más.</p>
            </div>
        </div>
    );
};

export default MemberDashboardPage;