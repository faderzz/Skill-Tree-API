const express = require("express");
const auth = require("../../middlewares/auth");
const SkillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", auth, SkillController.getSkills);
router.post("/createSkill", auth, SkillController.createSkill);
router.put("/updateSkill", auth, SkillController.updateSkill);
router.delete("/deleteSkill", auth, SkillController.deleteSkill);

module.exports = router;
