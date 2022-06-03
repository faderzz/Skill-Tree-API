const express = require("express");
const auth = require("../../middlewares/auth");
const skillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", auth, skillController.getSkills);
router.get("/available", auth, skillController.getAvailableSkills);
router.post("/createSkill", auth, skillController.createSkill);
router.post("/startSkill", auth, skillController.startSkill);
router.post("/skipSkill", auth, skillController.skipSkill);
router.post("/revertSkill", auth, skillController.revertSkill);
router.get("/inProgress", auth, skillController.getSkillsInProgress);
router.put("/updateSkill", auth, skillController.updateSkill);
router.delete("/deleteSkill", auth, skillController.deleteSkill);

module.exports = router;
