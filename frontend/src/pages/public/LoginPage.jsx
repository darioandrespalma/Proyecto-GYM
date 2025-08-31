import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser } from '../../api/authApi'; // Usaremos la función de la API directamente
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Obtenemos la acción 'login' de nuestro store síncrono
  const loginAction = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // --- EXPLICACIÓN DEL FLUJO CORRECTO ---
      // 1. Llamamos a la API para obtener el token.
      const data = await loginUser(email, password);
      
      // 2. Si la llamada es exitosa, usamos la acción del store para guardar el token.
      //    Esta acción es síncrona, por lo que el estado se actualiza inmediatamente.
      loginAction(data.access_token);
      
      // 3. Obtenemos el rol del usuario directamente del estado recién actualizado.
      const userRole = useAuthStore.getState().user.role;
      
      // 4. Ahora que el token está guardado, redirigimos al dashboard correspondiente.
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'trainer') {
        navigate('/trainer');
      } else if (userRole === 'member') {
        navigate('/member');
      } else {
        navigate('/'); // Fallback
      }

    } catch (err) {
      // Si la API falla, mostramos un error claro.
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      console.error('Login failed:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">GymPower Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="entrenador@gym.com"
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
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" color="primary" className="w-full !py-3 !mt-6" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
                Regístrate
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;