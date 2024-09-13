import passport from "passport";

export const authorization = (role) => {
    return async (req, res, next) => {
      // Ejecutar passportCall para autenticar al usuario
      passport.authenticate("jwt", function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res
            .status(401)
            .send({ error: info?.messages ? info.messages : info?.toString() });
        }
  
        req.user = user;
  
        // Verificar si el usuario tiene el rol requerido
        if (req.user.role !== role) {
          return res.status(403).send({ error: "No permission" });
        }
  
        next();
      })(req, res, next);
    };
  };
  