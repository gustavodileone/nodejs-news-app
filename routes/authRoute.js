// Dependencies
const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");

// Middlewares
const authorized = (req, res, next) => {
    if(res.locals.sessionUser) {
        res.status(200);
        return res.redirect("/");
    }

    next();
}

router.get("/login", authorized, authController.authLoginGet);
router.post("/login", authorized, authController.authLoginPost);

router.get("/register", authorized, authController.authRegisterGet);

router.get("/email-verification/:token", authController.authEmailVerificationToken);
router.post("/email-verification", authController.authAjaxEmailVerification);

module.exports = router;