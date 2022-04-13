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

    skill.validate(async err => {
      if (err) return res.status(400).json({ errCode: 400, message: "Validation failed. Please check your input.", error: err });

      if (await Skill.findOne({ iconName: skill.iconName }).exec()) return res.status(409).json({ errCode: 409, message: "Duplicate input, please check that the \"iconName\" field is not the same as any other document." });

      skill.save();

      return res.status(201).json(skill);
    })


  }

  editSkill(req, res) { }

  deleteSkill(req, res) { }
}

module.exports = new SkillController();
