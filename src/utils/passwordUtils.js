import bcrypt from "bcrypt";

//Encriptación de contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validación de contraseña
export const passwordValidation = (user, password) =>
  bcrypt.compareSync(password, user.password);
