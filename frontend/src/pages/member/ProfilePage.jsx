import React from 'react';

const ProfilePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                <p>Aquí podrás editar tu información de contacto y cambiar tu contraseña.</p>
                {/* Formulario de perfil iría aquí */}
            </div>
        </div>
    );
};

export default ProfilePage;