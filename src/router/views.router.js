import express from "express";

import { authorization, passportCall } from "../utils/passportUtils.js";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";

import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

const router = express.Router();

// Ruta para renderizar la vista index.handlebars con paginación
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit;
    const sort = req.query.sort; // Obtén el parámetro de ordenación
    const category = req.query.category; // Obtén el parámetro de categoría

    let filter = {};
    if (category) {
      filter.category = category;
    }

    let sortOrder;
    let result;
    if (sort) {
      sortOrder = sort === "desc" ? -1 : 1;
      result = await productsModel.paginate(filter, {
        page,
        limit,
        sort: { price: sortOrder }, // Ordenar por precio
      });
    } else {
      result = await productsModel.paginate(filter, {
        page,
        limit,
      });
    }

    // Obtener todas las categorías para el filtro
    const allCategories = await productsModel.distinct("category");

    result.sort = sort;
    result.category = category;
    result.categories = allCategories;
    result.prevLink = result.hasPrevPage
      ? `/?page=${result.prevPage}${limit < 10 ? `&limit=${limit}` : ""}${
          sort ? `&sort=${sort}` : ""
        }${category ? `&category=${category}` : ""}`
      : "";
    result.nextLink = result.hasNextPage
      ? `/?page=${result.nextPage}${limit < 10 ? `&limit=${limit}` : ""}${
          sort ? `&sort=${sort}` : ""
        }${category ? `&category=${category}` : ""}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render("index", result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al cargar los productos." });
  }
});

// Ruta para mostrar los detalles de un producto
router.get("/products/:pid", async (req, res) => {
  try {
    const idProduct = req.params.pid;

    const product = await productsModel.findOne({ _id: idProduct });

    if (product) {
      res.render("products/productDetail", {
        product,
      });
    } else {
      res.status(404).render("error/error", { msg: "Producto no encontrado." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("error/error", { msg: "Error al obtener el producto." });
  }
});

//Manejo de views de realtimeproducts
router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const products = await productsModel.find({}); // Cargar todos los productos desde la base de datos
      res.render("admin/realtimeproducts", {
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al cargar los productos." });
    }
  }
);

// Función para llenar el carrito con productos
const populateCarrito = async (carrito) => {
  return carrito.populate({
    path: "products.product",
    select: "id title price stock",
  });
};

// Ruta para mostrar el contenido del carrito 

router.get("/carts/:cid", passportCall("jwt"),isAuthenticated, async (req, res) => {
  try {
    const cartId = req.params.cid;
    let carritoEncontrado = await cartsModel.findOne({ _id: cartId });

    if (!carritoEncontrado) {
      return res
        .status(404)
        .render("error/error", { msg: "Carrito no encontrado." });
    }

    carritoEncontrado = await populateCarrito(carritoEncontrado);
    carritoEncontrado = {
      ...carritoEncontrado.toObject(),
      products: carritoEncontrado.products.map((product) => ({
        ...product.product.toObject(),
        quantity: product.quantity,
      })),
    };

    let totalPrice = carritoEncontrado.products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    totalPrice = totalPrice.toFixed(2);

    res.render("users/cart", {
      cart: carritoEncontrado,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener el carrito." });
  }
});

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("users/login");
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("users/register");
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("users/profile", { user: req.user });
});

router.get("/failedregister", (req, res) => {
  res.render("error/error", {
    msg: "El registro ha fallado, intenta nuevamente.",
  });
});

router.get("/faillogin", (req, res) => {
  res.render("error/error", {
    msg: "Login fallido. Por favor, revisa tus credenciales.",
  });
});

export default router;
