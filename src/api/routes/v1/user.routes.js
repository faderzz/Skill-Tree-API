const UserController = require("../../controllers/user.controller");
var express = require("express");
var router = express.Router();

router.get("/profile",UserController.profile);
router.post("/register",UserController.register);
router.post("/registerDiscord",UserController.registerDiscord);
router.post("/login", UserController.authUser);
router.get("/loginDiscord", UserController.authUserDiscord);
//router.post("/profile", UserController.updateUserProfile);
router.post("/updateUser",UserController.updateUser);
router.post("/addXP",UserController.addXP);
module.exports = router;