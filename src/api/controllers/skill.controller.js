const Skill = require("../../models/skill.model");

class SkillController {
  async getSkills(req, res) {
    try {
      const skills = await Skill.find({});
      const root = await Skill.find({
        requires: []
      });

      res.status(200).json({
        response: "success",
        skills: skills,
        root: root
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get skills" });
    }
  }

  async createSkill(req, res) {
    try {
      const skill = new Skill(req.body);

      skill.validate(async err => {
        if (err) return res.status(400).json({
          response: "error",
          error: err });

        if (await Skill.findOne({ title: skill.title, level: skill.level }).exec()) {
          return res.status(409).json({
            response: "error",
            error: "Skill already exists." });
        }

        skill.save();

        return res.status(201).json({
          response: "success",
          skill: skill
        });
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to create skill" });
    }
  }

  async updateSkill(req, res) {
    try {
      Skill.findByIdAndUpdate(req.body.id,
        {$set: req.body},
        (err, skill) => {
          if (err) return res.status(400).json({
            response: "error",
            error: err });

          return res.status(200).json({
            response: "success",
            skill: skill
          });
        }
      );
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to update skill" });
    }
  }

  async deleteSkill(req, res) {
    try {
      Skill.findByIdAndDelete(req.body.id);
      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to delete skill" });
    }
  }
}

module.exports = new SkillController();
