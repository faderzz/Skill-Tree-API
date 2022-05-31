const express = require("express");
const skillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", skillController.getSkills);
router.get("/available", skillController.getAvailableSkills);
router.post("/createSkill", skillController.createSkill);
router.post("/startSkill", skillController.startSkill);
router.get("/inProgress", skillController.getSkillsInProgress);
router.put("/updateSkill", skillController.updateSkill);
router.delete("/deleteSkill", skillController.deleteSkill);

module.exports = router;
