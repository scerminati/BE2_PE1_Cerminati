import express from "express";
import userModel from "../models/user.model.js";
import cartsModel from "../models/carts.model.js";
import { getNextIdC } from "../utils/utils.js";
import { createHash, passwordValidation } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/webTokenUtil.js";
import { passportCall } from "../utils/passportUtils.js";

const router = express.Router();

//Registro a través de passport con generación de carrito nuevo y pasaje de datos desde front al back y al database.
router.post("/register", async (req, res) => {
  const { first_name, last_name, password, email, age } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      console.log("El usuario ya existe");
      return res.status(400).send({ msg: "El correo electrónico ya está en uso" });
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
    
    const user = await userModel.findById(req.user._id).populate("cart");

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
      cart: user.cart, 
    });
  } catch (error) {
    console.error("Error al obtener los datos del usuario logueado:", error);
    res.status(500).send({ error: "Error al obtener los datos del usuario" });
  }
});


router.post("/checkout", passportCall("jwt"), async (req, res) => {
  //Acá tendría que añadir una collection con mis checkouts, donde tenga usuario, address, etc.... datos de usuario + compra.
  try {
    const user = await userModel.findById(req.user._id).populate("cart");
    if (!user || !user.cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    // Crea un nuevo carrito
    const newCartId = await getNextIdC(cartsModel); // Genera un nuevo ID
    const newCart = new cartsModel({ id: newCartId, products: [] });
    await newCart.save();

    // Actualiza el usuario con el nuevo carrito
    user.cart = newCart._id;
    await user.save();

    // Responder al cliente con un mensaje de éxito
    res.status(200).send({ msg: "Compra realizada exitosamente" });
  } catch (error) {
    console.error("Error al completar la compra:", error);
    res.status(500).send({ error: "Error al completar la compra" });
  }
});

export default router;
