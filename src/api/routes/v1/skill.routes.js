const express = require("express");
const skillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", skillController.getSkills);
router.get("/available", skillController.getAvailableSkills);
router.post("/createSkill", skillController.createSkill);
router.post("/startSkill", skillController.startSkill);
router.get("/skillsInProgress", skillController.getSkillsInProgress);
//router.put("/:id", skillController.editSkill);
//router.delete("/:id", skillController.deleteSkill);

module.exports = router;
