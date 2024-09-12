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
            console.log("El usuario existe");
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
          return null, result;
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          console.log("el usuario no existe");
          // if (!user) return res.status(403).send("Usuario o Contraseña incorrecta");
          return done(null, false);
        }
        if (!passwordValidation(user, password)) {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default initializePassport;
