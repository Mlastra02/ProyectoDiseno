import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message);
        return;
      }

      const { sessionId } = await res.json();
      localStorage.setItem('token', sessionId); // Guardar el sessionId
      router.push('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error inesperado. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Iniciar Sesión
        </button>
      </div>
   
