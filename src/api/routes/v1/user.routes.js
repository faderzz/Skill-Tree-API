const UserController = require("../../controllers/user.controller");
const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/deleteUser",auth, UserController.deleteUser);
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
router.get("/getAvailable", auth, UserController.getAvailableTasks);
router.get("/getInProgress", auth, UserController.getInProgress);
router.get("/getCompleted", auth, UserController.getCompleted);
router.post("/start", auth, UserController.startSkill);
router.post("/skip", auth, UserController.skip);
router.post("/revert", auth, UserController.revert);
router.post("/cancel", auth, UserController.cancel);
router.post("/eraseCompleted", auth, UserController.eraseCompleted);
router.post("/saveWeekly", auth, UserController.saveWeekly);
router.post("/setReminded", auth, UserController.setReminded);

module.exports = router;
