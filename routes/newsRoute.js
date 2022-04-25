const express = require("express");
const newsController = require("../controllers/newsController");
const route = express.Router();

//Middlewares:
const notAuthenticated = (req, res, next) => {
    if(!req.session.isAuth) {
        res.status(401);
        res.redirect("/login");
    }

    next();
}


//Routes:
route.get("/create", notAuthenticated, newsController.newsCreateGet);
route.post("/create", notAuthenticated, newsController.newsCreatePost);

route.get("/edit/:slug", notAuthenticated, newsController.newsEditGet);
route.patch("/edit/:id", notAuthenticated, newsController.newsEditPatch);

route.delete("/delete/:id", notAuthenticated, newsController.newsDelete);

route.get("/:slug", newsController.newsSlugGet);

module.exports = route;