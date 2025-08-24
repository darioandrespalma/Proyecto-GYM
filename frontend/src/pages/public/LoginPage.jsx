import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../api/authApi';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  // --- CORRECCIÓN 1: El estado inicial ahora está vacío ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ----------------------------------------------------

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { access_token } = await loginUser(email, password);
      login(access_token);
      
      const userRole = useAuthStore.getState().user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'member') {
        navigate('/member');
      } else if (userRole === 'trainer') {
        navigate('/trainer');
      }

    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">GymPower Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* --- CORRECCIÓN 2: Añadimos los campos de entrada --- */}
          <Input 
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
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
          {/* -------------------------------------------------- */}
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <Button type="submit" color="primary" className="w-full !py-3 !mt-6" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Regístrate aquí
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;