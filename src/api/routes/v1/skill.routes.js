const express = require("express");
const auth = require("../../middlewares/auth");
const SkillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", auth, SkillController.getSkills);
router.get("/available", auth, SkillController.getAvailableSkills);
router.post("/createSkill", auth, SkillController.createSkill);
router.post("/startSkill", auth, SkillController.startSkill);
router.post("/skipSkill", auth, SkillController.skipSkill);
router.post("/revertSkill", auth, SkillController.revertSkill);
router.get("/inProgress", auth, SkillController.getSkillsInProgress);
router.put("/updateSkill", auth, SkillController.updateSkill);
router.delete("/deleteSkill", auth, SkillController.deleteSkill);
router.get("/getAllInList", auth, SkillController.getAllInList);

module.exports = router;
