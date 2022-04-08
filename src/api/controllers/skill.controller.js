const Skill = require('../../models/skill.model');

class SkillController {
  async getSkills(req, res) {
    console.log('GET /skills');

    const skills = await Skill.find({});
    console.log(skills)

    res.status(200).json(skills);
  }

  createSkill(req, res) {
    console.log('POST /skills');

    const skill = new Skill(req.body);
    skill.save();

    response.status(201).json(skill);
  }

  editSkill(req, res) {}

  deleteSkill(req, res) {}
}

module.exports = new SkillController();
