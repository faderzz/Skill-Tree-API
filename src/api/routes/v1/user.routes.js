const UserController = require("../../controllers/user.controller");
var express = require("express");
var router = express.Router();

router.post("/register",UserController.register);
router.post("/registerDiscord",UserController.registerDiscord);
router.post("/login", UserController.authUser);
router.post("/loginDiscord", UserController.authUserDiscord);
router.post("/profile", UserController.updateUserProfile);
router.delete("/",UserController.removeUser);

module.exports = router;