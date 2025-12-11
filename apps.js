import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chambresRoutes from "./routes/chambres.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route ACCUEIL
app.get("/", (req, res) => {
    res.render("accueil", {
        title: "Hôtel California - Système de Gestion"
    });
});

// ➜ Ici on connecte TOUTES les pages chambres 
app.use("/chambres", chambresRoutes);

// 404
app.use((req, res) => {
    res.status(404).render("error", {
        title: "Page non trouvée",
        error: "La page demandée n'existe pas."
    });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
