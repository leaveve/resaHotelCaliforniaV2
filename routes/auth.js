router.get("/", (req, res) => {
    res.render("accueil", { title: "Connexion" });
});

router.get("/login", (req, res) => {
    res.redirect("/");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@hotel.com" && password === "admin") {
        return res.redirect("/dashboard"); // par exemple
    }

    res.render("accueil", {
        title: "Connexion",
        error: "Identifiants incorrects."
    });
});
