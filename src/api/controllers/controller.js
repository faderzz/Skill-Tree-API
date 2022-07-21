const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const Challenge = require("../../models/challenge.model");

class Controller {
  async getNodes(req, res) {
    console.log("GET /getNodes");

    const skills = await Skill.find({});
    const items = await Item.find({});
    const challenges = await Challenge.find({});
    const root = await Skill.find({
      requires: []
    });

    res.status(200).json({
      response: "success",
      skills: skills,
      items: items,
      challenges: challenges,
      root: root,
    });
  }

  async inList(req, res) {
    console.log("GET /inList");

    const IDs = req.headers.list.replace(/\s/g, "").split(",");
    const skills = await Skill.find({
      _id : {$in : IDs}
    });
    const challenges = await Challenge.find({
      _id : {$in : IDs}
    });

    res.status(200).json({
      response: "success",
      list: skills.concat(challenges),
    });
  }

  async getStatus(req, res) {
    console.log("GET /status");
    res.status(200).json({
      response: "success",
    });
  }
}

module.exports = new Controller();
