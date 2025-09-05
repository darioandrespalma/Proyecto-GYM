// src/pages/public/LoginPage.jsx (con logo centrado)
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GlitchText from '../../components/common/GlitchText';
import Lightning from '../../components/common/Lightning';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const loginAction = useAuthStore((state) => state.login);
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900">
            {/* Efecto Lightning de fondo */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Lightning hue={200} speed={0.3} intensity={0.5} size={1.2} />
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

            <div className="w-full flex flex-col items-center justify-center p-8 relative z-10">
                {/* Logo centrado en la parte superior */}
                <div className="w-full text-center mb-8">
                    <GlitchText 
                        speed={0.8} 
                        enableShadows={true} 
                        className="text-5xl md:text-6xl mb-4"
                    >
                        GYMPOWER
                    </GlitchText>
                    <p className="text-gray-300 text-lg">Entrena como un profesional</p>
                </div>
                
                <div className={`w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input 
                            label="Email" 
                            id="email" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tuemail@ejemplo.com" 
                            required 
                        />
                        <Input 
                            label="Contraseña" 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                        />
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            color="primary" 
                            className="w-full py-3 text-lg font-semibold rounded-xl" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Ingresando...
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            ¿No tienes cuenta?{' '}
                            <Link 
                                to="/register" 
                                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Sección inferior con información */}
                <div className="w-full max-w-4xl mt-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Transforma tu <span className="text-blue-400">cuerpo</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Únete a la revolución fitness y alcanza tus metas con nuestra comunidad.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 animate-float min-w-[120px]" style={{animationDelay: '0.5s'}}>
                            <div className="text-3xl">💪</div>
                            <p className="text-white text-sm mt-2">Fuerza</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 animate-float min-w-[120px]" style={{animationDelay: '1s'}}>
                            <div className="text-3xl">🏃</div>
                            <p className="text-white text-sm mt-2">Cardio</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 animate-float min-w-[120px]" style={{animationDelay: '1.5s'}}>
                            <div className="text-3xl">🧠</div>
                            <p className="text-white text-sm mt-2">Mental</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;