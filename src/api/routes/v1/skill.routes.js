const express = require("express");
const skillController = require("../../controllers/skill.controller");

const router = express.Router();

router.get("/", skillController.getSkills);
router.post("/createSkill", skillController.createSkill);
router.post("/startSkill", skillController.startSkill);
//router.put("/:id", skillController.editSkill);
//router.delete("/:id", skillController.deleteSkill);

module.exports = router;
