import express from "express";

import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import path from "path";
import __dirname from "./utils/utils.js";

import mongoose from "mongoose";
import handlebars from "express-handlebars";

import cartRouter from "./router/cart.router.js";
import productsRouter from "./router/products.router.js";
import sessionRouter from "./router/session.router.js";
import viewsRouter from "./router/views.router.js";

import { Server } from "socket.io";
import { helpers } from "./utils/utils.js";

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(cookieParser("SCerminati2024"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://sofiacermi:BEFinal@beproject.jrrw5gf.mongodb.net/SoGames?retryWrites=true&w=majority&appName=BEProject",
      mongoOptions: {},
      ttl: 15,
    }),
    secret: "SCerminati2024",
    resave: false,
    saveUninitialized: false,
  })
);

//COOKIES
app.get("/setCookie", (req, res) => {
  res
    .cookie("Nombre", "soy una cookie", { maxAge: 10000, signed: "true" })
    .send("Nombre");
});

app.get("/getCookie", (req, res) => {
  res.send(req.signedCookies);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("Nombre").send("Cookie borrada");
});

app.get("/deleteAllCookies", (req, res) => {
  // Iterar sobre cada cookie
  for (let cookie in req.cookies) {
    // Eliminar la cookie
    res.clearCookie(cookie);
  }

  // Enviar la respuesta al cliente
  res.send("Todas las cookies han sido borradas");
});

///SESSION
app.get("/session", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`esta es tu visita ${req.session.counter}`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido");
  }
});

initializePassport();
app.use(passport.initialize());
app.use(passport.session);

//Autentificador para chequear el administrador.
function auth(req, res, next) {
  if (req.session?.user.admin) {
    return next();
  }
  res.status(403).send("No estás autorizado");
}

app.get("/privado", auth, (req, res) => {
  res.send("bienvenido administrador");
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Conexión a la base de datos
mongoose
  .connect(
    "mongodb+srv://sofiacermi:BEFinal@beproject.jrrw5gf.mongodb.net/SoGames?retryWrites=true&w=majority&appName=BEProject"
  )
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((error) =>
    console.error("Error al conectar con la base de datos", error)
  );

//Rutas
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

// Crear instancia de Handlebars con helpers personalizados
const hbs = handlebars.create({
  helpers: helpers,
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

//Handlebars
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

//Estáticos
app.use(express.static(path.join(__dirname, "../public")));

//Configuración Socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const socketServer = configureSocketServer(httpServer);

// Lógica de configuración del servidor de Socket.io
function configureSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  return io;
}
