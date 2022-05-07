// Dependencies
const express = require("express");
const router = express.Router();

// Controller
const ajaxController = require("../controllers/ajaxController");

router.post("/send-email-verification", ajaxController.ajaxRegisterUser);

module.exports = router;