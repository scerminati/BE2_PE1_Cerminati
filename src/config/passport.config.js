import passport from "passport";
import jwt from "passport-jwt";
import userModel from "../models/user.model.js";
import { createHash, passwordValidation } from "../utils/passwordUtils.js";
import dotenv from "dotenv";

dotenv.config();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  console.log(req.headers);
  if (req && req.headers) {
    token = req.headers.authorization.split(" ")[1];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_PASSPORT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
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
