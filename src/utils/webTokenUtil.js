import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id }, SECRET_PASSPORT, { expiresIn: "24h" });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No autenticado" });
  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_PASSPORT, (error, credentials) => {
    if (error) return res.status(403).send({ error: "no estás autorizado" });
    req.user = credentials.user;
    next();
  });
};

export { generateToken, authToken };
