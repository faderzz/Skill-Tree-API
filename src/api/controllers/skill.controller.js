const Skill = require("../../models/skill.model");

class SkillController {
  async getSkills(req, res) {
    console.log("GET /skills");

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

  async createSkill(req, res) {
    console.log("POST /skills/create");

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

  async updateSkill(req, res) {
    console.log("POST /skills/update");

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

  async deleteSkill(req, res) {
    console.log("POST /skills/delete");

    Skill.findByIdAndDelete(req.body.id);
    res.status(200).json({response: "success"});
  }
}

module.exports = new SkillController();
