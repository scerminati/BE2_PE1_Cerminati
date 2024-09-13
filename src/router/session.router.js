import express from "express";
import passport from "passport";

const router = express.Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).send("Usuario o Contraseña incorrecta");

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        admin: req.user.admin,

        
      };

      res.status(200).send(`Bienvenido ${req.user.first_name}`);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).send({ msg: "Error en el servidor al iniciar sesión" });
    }
  }
);

router.post("/logout", (req, res) => {
  if (!req.session.user)
    return res.status(400).send("No hay ninguna sesión activa");

  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

export default router;
