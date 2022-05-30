const express = require("express");
const newsCommentsController = require("../controllers/newsCommentsController");
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
route.post("/create", notAuthenticated, newsCommentsController.commentsCreatePost);


route.patch("/edit/:comments_id", notAuthenticated, newsCommentsController.commentsEditPatch);

route.delete("/delete/:comments_id", notAuthenticated, newsCommentsController.commentsDelete);

module.exports = route;