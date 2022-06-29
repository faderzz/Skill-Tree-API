const UserController = require("../../controllers/user.controller");
const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/profile", auth, UserController.profile);
router.post("/register", auth, UserController.register);
router.post("/registerDiscord", auth, UserController.registerDiscord);
router.post("/login", auth, UserController.authUser);
router.get("/loginDiscord", auth, UserController.authUserDiscord);
router.post("/updateUser", auth, UserController.updateUser);
router.post("/updateXPHistory", auth, UserController.updateXPHistory);
router.post("/updateTimezone", auth, UserController.updateTimezone);
router.post("/updateBaseLocation", auth, UserController.updateBaseLocation);
router.get("/getAllInTimezone", auth, UserController.getAllInTimezone);
router.get("/getAll", auth, UserController.getAll);
router.get("/getAvailable", auth, UserController.getAvailable);
module.exports = router;