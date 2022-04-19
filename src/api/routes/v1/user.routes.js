const {authUser,registerUser, updateUserProfile,removeUser} = require("../controllers/user.controller.js");
var express = require('express');
var router = express.Router();


router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/profile").post(updateUserProfile)
router.delete('/',removeUser);
module.exports = router;