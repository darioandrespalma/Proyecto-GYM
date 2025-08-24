import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@gym.com');
  const [password, setPassword] = useState('adminpass');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { access_token } = await loginUser(email, password);
      login(access_token);
      
      // Redirigir basado en el rol del usuario
      const userRole = useAuthStore.getState().user.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'member') {
        navigate('/member/dashboard');
      } else if (userRole === 'trainer') {
        navigate('/trainer/dashboard');
      }

    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">GymPower Login</h1>
        <form onSubmit={handleLogin}>
          {/* Form fields... */}
           <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;