import express from "express";

import path from "path";
import __dirname from "./utils/utils.js";

import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import mongoose from "mongoose";
import handlebars from "express-handlebars";

import cartRouter from "./router/cart.router.js";
import productsRouter from "./router/products.router.js";
import sessionRouter from "./router/session.router.js";
import viewsRouter from "./router/views.router.js";

import { Server } from "socket.io";
import { helpers } from "./utils/utils.js";

import dotenv from "dotenv";

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const SECRET_PASSPORT = process.env.SECRET_PASSPORT;

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ** Configura el middleware express-session **
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DATABASE_URL,
      mongoOptions: {},
      ttl: 360,
    }),
    secret: SECRET_PASSPORT,
    resave: false,
    saveUninitialized: false,
  })
);

//Passport para autenticación y autorización
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//Conexión a la base de datos
mongoose
  .connect(DATABASE_URL)
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
app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");

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
