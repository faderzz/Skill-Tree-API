const Challenge = require("../../models/challenge.model");
const Skill = require("../../models/skill.model");

class TreeController {
  async getTree(req, res) {
    const skills = await Skill.find({});
    const challenges = await Challenge.find({});

    res.status(200).json({
      response: "success",
      skills: skills,
      challenges: challenges
    });
  }
}

module.exports= new TreeController();
