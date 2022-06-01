const express = require("express");
const challengeController = require("../../controllers/challenge.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, challengeController.getChallenges);
router.post("/createSkill", auth, challengeController.createChallenge);
router.put("/updateItem", auth, challengeController.updateChallenge);
router.delete("/deleteItem", auth, challengeController.deleteSkill);

module.exports = router;
