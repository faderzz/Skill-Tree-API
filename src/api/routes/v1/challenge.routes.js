const express = require("express");
const challengeController = require("../../controllers/challenge.controller");

const router = express.Router();

router.get("/", challengeController.getChallenges);
router.post("/createSkill", challengeController.createChallenge);
router.put("/updateItem", challengeController.updateChallenge);
router.delete("/deleteItem", challengeController.deleteSkill);

module.exports = router;
