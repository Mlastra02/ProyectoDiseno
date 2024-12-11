// src/lib/auth.js
import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const { token } = req.cookies;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.username;
  } catch (error) {
    return null;
  }
}
