// Dependencies
const express = require("express");
const router = express.Router();

// Controllers
const indexController = require("../controllers/indexController");

//Routes
router.get("/", indexController.indexGet);

router.post("/logout", indexController.indexLogoutPost);

module.exports = router;