import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1m" });
};

export const verifyToken = (token) => {
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
};
