import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id }, SECRET_PASSPORT, {
    expiresIn: "1h",
  });
  return token;
};

// const authToken = (req, res, next) => {
//   // Verifica si el encabezado Authorization está presente
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res
//       .status(401)
//       .send({ error: "No autenticado: Encabezado faltante" });

//   // Extrae el token del encabezado
//   const token = authHeader.split(" ")[1];
//   if (!token)
//     return res.status(401).send({ error: "No autenticado: Token faltante" });

//   // Verifica el token
//   jwt.verify(token, SECRET_PASSPORT, (error, credentials) => {
//     if (error) {
//       console.error("Token no válido:", error); // Imprime el error para depuración
//       return res
//         .status(403)
//         .send({ error: "No estás autorizado: Token inválido" });
//     }

//     // Si el token es válido, guarda las credenciales en req.user
//     req.user = credentials;
//     next();
//   });
// };

export { generateToken };
