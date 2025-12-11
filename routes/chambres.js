import express from "express";
const router = express.Router();

// LISTE DES CHAMBRES
router.get("/", (req, res) => {
    const chambres = [
        { id: 1, numero: 101, type: "Simple", prix: 50 },
        { id: 2, numero: 102, type: "Double", prix: 75 },
    ];

    res.render("chambres/index", { chambres });
});

// PAGE AJOUTER UNE CHAMBRE
router.get("/create", (req, res) => {
    res.render("chambres/create");
});

// TRAITEMENT AJOUT
router.post("/", (req, res) => {
    res.redirect("/chambres");
});

// PAGE EDIT
router.get("/:id/edit", (req, res) => {
    const chambre = {
        id: req.params.id,
        numero: 101,
        type: "Simple",
        prix: 50
    };

    res.render("chambres/edit", { chambre });
});

// TRAITEMENT EDIT
router.post("/:id/edit", (req, res) => {
    res.redirect("/chambres");
});

// PAGE DELETE
router.get("/:id/delete", (req, res) => {
    const chambre = {
        id: req.params.id,
        numero: 101
    };

    res.render("chambres/delete", { chambre });
});

// TRAITEMENT DELETE
router.post("/:id/delete", (req, res) => {
    res.redirect("/chambres");
});

export default router;
