import { useState } from 'react';
import { useRouter } from 'next/router';
import { MdPerson, MdLock } from 'react-icons/md';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Inicio de sesión exitoso');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setMessage(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      setMessage(`Error en la conexión con el servidor: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="w-full max-w-md p-8 bg-blue-800 bg-opacity-90 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <MdPerson className="absolute left-3 top-3 text-yellow-400" size={24} />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-700 bg-opacity-80 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
            />
          </div>
          <div className="relative">
            <MdLock className="absolute left-3 top-3 text-yellow-400" size={24} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-700 bg-opacity-80 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Iniciar Sesión
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-400">{message}</p>}
        <p className="mt-6 text-center text-gray-300">
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}
