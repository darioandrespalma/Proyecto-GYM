import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
// --- CAMBIO 1: Importar la función real de la API ---
import { registerUser } from '../../api/authApi';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            // --- CAMBIO 2: Usar la función real en lugar de la simulación ---
            await registerUser(formData);
            
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');

        } catch (err) {
            // Mostrar el error que viene del backend si está disponible
            const errorMessage = err.response?.data?.detail || 'Hubo un error al registrar la cuenta.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input id="fullName" label="Nombre Completo" value={formData.fullName} onChange={handleChange} required />
                    <Input id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                    <Input id="phone" label="Teléfono" type="tel" value={formData.phone} onChange={handleChange} />
                    <Input id="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} required />
                    <Input id="confirmPassword" label="Confirmar Contraseña" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" color="primary" className="w-full !py-3 !mt-6" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
