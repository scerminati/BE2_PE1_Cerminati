import express from "express";
import userModel from "../models/user.model.js";
import cartsModel from "../models/carts.model.js";
import { getNextIdC } from "../utils/utils.js";
import { createHash, passwordValidation } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/webTokenUtil.js";
import { passportCall } from "../utils/passportUtils.js";
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
      role: "user",
    };

    let createdUser = await userModel.create(newUser);
    console.log("Usuario creado exitosamente:", createdUser);

    // Create a new cart for the user
    const id = await getNextIdC(cartsModel); // Assuming getNextIdC generates a new id
    const newCart = new cartsModel({ id, products: [] });
    await newCart.save();
    console.log(`Nuevo carrito creado para el usuario con id ${newCart._id}`);

    // Update the user with the cart's ObjectId
    createdUser.cart = newCart._id;
    await createdUser.save();
    console.log("Carrito asignado al usuario:", createdUser);

    // Set a JWT cookie
    res.cookie("jwt", generateToken(createdUser), {
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

//Current user
router.get("/current", passportCall("jwt"), async (req, res) => {
  try {
    // Recupera el ID del usuario desde el token (req.user se llena en authToken)
    const user = await userModel.findById(req.user.id).populate("cart");

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Envía la información del usuario como respuesta
    res.send({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart, // Incluye el carrito si está poblado
    });
  } catch (error) {
    console.error("Error al obtener los datos del usuario logueado:", error);
    res.status(500).send({ error: "Error al obtener los datos del usuario" });
  }
});

export default router;
