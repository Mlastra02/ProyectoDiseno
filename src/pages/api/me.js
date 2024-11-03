// src/pages/api/me.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'No autenticado' });

  const token = authorization.split(' ')[1]; // El formato esperado es "Bearer <token>"
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ username: decoded.username });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
