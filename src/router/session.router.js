import express from "express";
import userModel from "../models/user.model.js";
import { createHash, passwordValidation } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/webTokenUtil.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const router = express.Router();

//Registro
router.post("/register", async (req, res) => {
  const { first_name, last_name, password, email, age } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      console.log("El usuario ya existe");
      //PONER ERROR
    }

    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      admin: false,
    };

    let result = await userModel.create(newUser);
    console.log("Usuario creado exitosamente:", result);

    res.cookie("jwt", generateToken(result), {
      httpOnly: true,
      secure: false,
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    //ERROR
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("El usuario no existe");
    }
    if (!passwordValidation(user, password)) {
      console.log("Contraseña incorrecta");
    }

    res.cookie("jwt", generateToken(user), {
      httpOnly: true,
      secure: false,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send({ msg: "Error en el servidor al iniciar sesión" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

export default router;
