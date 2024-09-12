import express from "express";
import passport from "passport";

const router = express.Router();


router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/error" }),
  async (req, res) => {
    res.send(500).status("Usuario registrado");
    res.redirect("/login");
  }
);

router.get("/failedregister", async (req, res) => {
  console.log("estrategia fallida");
  res.send("error");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/failedlogin" }),
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

      res.status(500).send(`Bienvenido ${user.first_name}`);


    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).send("Error en el servidor al iniciar sesión");
    }
  }
);

router.get("faillogin", (req, res) => {
  res.send({ error: "Login fallido" });
});

router.post("/logout", (req, res) => {
  if (!req.session.user)
    return res.status(400).send("No hay ninguna sesión activa");

  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

export default router;
