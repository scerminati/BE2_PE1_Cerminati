//Autenticar el inicio de sesión mediante passport y redirecciones correspondientes

import passport from "passport";

export const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si el usuario no está autenticado, redirige al login
      return res.redirect("/login");
    }

    // Si el usuario está autenticado, continúa
    req.user = user;
    next();
  })(req, res, next);
};

export const isNotAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Si el usuario no está autenticado, permite el acceso a la ruta
      return next();
    }

    // Si el usuario ya está autenticado, redirige al perfil
    return res.redirect("/profile");
  })(req, res, next);
};
