const express = require("express");
const challengeController = require("../../controllers/challenge.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, challengeController.getChallenges);
router.post("/createChallenge", auth, challengeController.createChallenge);
router.put("/updateChallenge", auth, challengeController.updateChallenge);
router.delete("/deleteChallenge", auth, challengeController.deleteChallenge);

module.exports = router;
