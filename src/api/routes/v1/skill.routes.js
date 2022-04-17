const express = require('express');
const skillController = require('../../controllers/skill.controller');

const router = express.Router();
const prefix = "/v1/skills"

router.get(prefix + '/', skillController.getSkills);
router.post(prefix + '/', skillController.createSkill);
router.put(prefix + '/:id', skillController.editSkill);
router.delete(prefix + '/:id', skillController.deleteSkill);

module.exports = router;