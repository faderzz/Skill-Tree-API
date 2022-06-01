const express = require("express");
const auth = require("../../middlewares/auth");
const skillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", skillController.getSkills);
router.get("/available", skillController.getAvailableSkills);
router.post("/createSkill", skillController.createSkill);
router.post("/startSkill", skillController.startSkill);
router.post("/completeSkill", skillController.completeSkill);
router.get("/inProgress", skillController.getSkillsInProgress);
router.put("/updateSkill", auth, skillController.updateSkill);
router.delete("/deleteSkill", auth, skillController.deleteSkill);

module.exports = router;
