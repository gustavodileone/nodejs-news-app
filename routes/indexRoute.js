// Dependencies
const express = require("express");
const router = express.Router();

// Controllers
const indexController = require("../controllers/indexController");

// Middlewares
const authorized = (req, res, next) => {
    if(res.locals.user) {
        res.status(200);
        return res.redirect("/");
    }

    next();
}

//Routes

router.get("/", indexController.indexGet);

router.get("/login", authorized, indexController.indexLoginGet);
router.post("/login", authorized, indexController.indexLoginPost);

router.get("/register", authorized, indexController.indexRegisterGet);
router.post("/register", authorized, indexController.indexRegisterPost);

router.post("/logout", indexController.indexLogoutPost);

module.exports = router;