import express from "express";

import userModel from "../models/user.model.js";

import { createHash, passwordValidation } from "../utils/passwordUtils.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists)
      return res.status(400).send("El usuario ya está registrado");

    const user = new userModel({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      admin: false,
    });

    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).send("Error de registro en el servidor");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(403).send("Usuario o Contraseña incorrecta");

    const isMatch = passwordValidation(user, password);
    if (!isMatch)
      return res.status(403).send("Usuario o Contraseña incorrecta");

    res.status(500).send(`Bienvenido ${user.first_name}`);
    delete user.password;

    req.session.user = user;

    res.redirect("/profile");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error en el servidor al iniciar sesión");
  }
});

router.post("/logout", (req, res) => {
  if (!req.session.user)
    return res.status(400).send("No hay ninguna sesión activa");

  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

export default router;
