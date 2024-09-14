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

export { generateToken };
