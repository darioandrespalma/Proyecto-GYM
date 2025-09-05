import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerUser } from '../../api/authApi';
import GlitchText from '../../components/common/GlitchText';
import Lightning from '../../components/common/Lightning';

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
            await registerUser(formData);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Hubo un error al registrar la cuenta.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
            {/* Efecto Lightning de fondo */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Lightning hue={270} speed={0.4} intensity={0.6} size={1.3} />
            </div>
            
            {/* Partículas de fondo */}
            <div className="absolute inset-0 z-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 2}px`,
                            height: `${Math.random() * 10 + 2}px`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="w-full flex flex-col items-center justify-center p-4 relative z-10">
                {/* Logo centrado en la parte superior */}
                <div className="w-full text-center mb-4">
                    <GlitchText 
                        speed={0.8} 
                        enableShadows={true} 
                        className="text-4xl md:text-5xl mb-2"
                    >
                        GYMPOWER
                    </GlitchText>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md p-6">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
                        <p className="text-gray-300 mt-1">Únete a nuestra comunidad fitness</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input id="fullName" label="Nombre Completo" value={formData.fullName} onChange={handleChange} required />
                        <Input id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                        <Input id="phone" label="Teléfono" type="tel" value={formData.phone} onChange={handleChange} />
                        <Input id="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} required />
                        <Input id="confirmPassword" label="Confirmar Contraseña" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            color="primary" 
                            className="w-full !py-3 !mt-4 rounded-xl" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Registrando...
                                </div>
                            ) : (
                                'Registrarse'
                            )}
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm text-gray-300 mt-4">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;