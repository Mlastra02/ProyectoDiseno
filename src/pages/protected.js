// src/pages/protected.js
import { verifyToken } from '@/lib/auth'; // Importa la función verifyToken
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
      } else {
        router.push('/login'); // Redirige al login si no está autenticado
      }
    }
    checkAuth();
  }, []);

  if (!username) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h1>Bienvenido, {username}</h1>
      <p>Esta es una página protegida.</p>
    </div>
  );
}
