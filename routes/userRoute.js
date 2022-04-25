const express = require("express");
const userController = require("../controllers/userController");
const route = express.Router();

// Routes:
route.get("/:slug", userController.indexGet);
route.get("/edit/:slug", userController.userEditGet);

route.patch("/edit/:id", userController.userEditPatch);

route.get("/edit-password/:slug", userController.userEditPasswordGet);
route.patch("/edit-password/:id", userController.userEditPasswordPatch);

route.get("/delete-user/:slug", userController.userDeleteGet);
route.delete("/delete-user/:id", userController.userDeleteDelete);

module.exports = route;