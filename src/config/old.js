import passport from "passport";
import local from "passport-local";
import userModel from "../models/user.model.js";
import { createHash, passwordValidation } from "../utils/passwordUtils.js";


const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
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
          return done(null, result);  // Aquí devolvemos el nuevo usuario
        } catch (error) {
          console.error("Error al registrar usuario:", error);
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          if (!passwordValidation(user, password)) {
            console.log("Contraseña incorrecta");
            return done(null, false);  // Devolvemos false si la contraseña no es correcta
          }
          return done(null, user);
        } catch (error) {
          console.error("Error en la autenticación:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;


