import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const loginAction = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const backgroundSvgUrl = "http://127.0.0.1:8000/api/v1/assets/login-background.svg";
    const gymIconSvgUrl = "http://127.0.0.1:8000/api/v1/assets/gym-icon.svg";

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            loginAction(data.access_token);
            const userRole = useAuthStore.getState().user.role;
            const homePath = { admin: '/admin', trainer: '/trainer', member: '/member' }[userRole] || '/';
            navigate(homePath);
        } catch (err) {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const transitionClasses = 'transition-all duration-1000 ease-in-out';

    return (
        <div className="min-h-screen flex">
            {/* Panel Izquierdo: Fondo SVG y Contenido */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden">
                <img 
                    src={backgroundSvgUrl} 
                    alt="Fondo dinámico"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                <div className="relative z-10 text-white text-center p-8 max-w-md">
                    <img 
                        src={gymIconSvgUrl} 
                        alt="GymPower Logo" 
                        className={`h-28 w-28 mx-auto mb-8 drop-shadow-lg ${transitionClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                        style={{ transitionDelay: '200ms' }}
                    />
                    <h2 className={`text-5xl font-extrabold mb-4 leading-tight ${transitionClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                        style={{ transitionDelay: '400ms' }}>
                        Transforma tu Cuerpo, Transforma tu Vida.
                    </h2>
                    <p className={`text-lg text-gray-300 ${transitionClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                        style={{ transitionDelay: '600ms' }}>
                        Únete a la comunidad de GymPower y lleva tu entrenamiento al siguiente nivel.
                    </p>
                </div>
            </div>

            {/* Panel Derecho: Formulario de Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className={`w-full max-w-sm ${transitionClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Bienvenido de Nuevo</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input 
                            label="Email" id="email" type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tuemail@gimnasio.com" required
                        />
                        <Input 
                            label="Contraseña" id="password" type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" required
                        />
                        {error && <p className="text-red-500 text-sm text-center -mt-3">{error}</p>}
                        <Button type="submit" color="primary" className="w-full py-3 text-lg font-semibold" disabled={loading}>
                            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                    <p className="text-center text-base text-gray-600 mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;