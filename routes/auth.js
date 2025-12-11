
import express from 'express';
const router = express.Router();

// La page de login
router.get("/", (req, res) => {
    res.render("accueil", { title: "Connexion" });
});

// /login redirige vers /
router.get("/login", (req, res) => {
    res.redirect("/");
});

// Traitement du formulaire login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Identifiants corrects ?
    if (email === "admin@hotel.com" && password === "admin") {
        return res.redirect("/accueil");   // 🔥 REDIRECTION CORRECTE
    }

    // Sinon erreur
    res.render("accueil", {
        title: "Connexion",
        error: "Identifiants incorrects."
    });
});

export default router;
