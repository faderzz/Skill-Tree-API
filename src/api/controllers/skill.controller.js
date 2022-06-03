const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Task = require("../../models/task.model");

class SkillController {
  async getSkillsInProgress(req, res) {
    console.log("GET /skillsInProgress");

    const user = await User.findById(req.headers["userid"]);
    const skills = await Skill.find({
      _id: {$in : user.get("skillsinprogress")}, 
    });
    res.status(200).json({
      response: "success",
      skills: skills});
  }

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

  async getAvailableSkills(req, res) {
    console.log("GET /skills/available");

    const user = await User.findById(req.headers["id"]);
    const completed = user.get("skillscompleted");

    const skills = await Skill.find({
      _id: {$nin : user.get("skillsinprogress").concat(completed)}, //skill not in progress
      $expr: {$setIsSubset: ["$requires", completed]},
    });

    res.status(200).json({
      response: "success",
      skills: skills
    });
  }

  async startSkill(req, res) {
    console.log("POST /skills/startSkill");

    //Get skill to star
    const skill = await Skill.findById(req.body.skillid);
    const user = await User.findById(req.body.id);

    const task = new Task({
      userID: user.get("_id"),
      skillID: skill.get("_id"),
      startDate: new Date(),
      data: [],
      completed: false,
    });
    task.save();

    //Update the user to start the skill
    user.get("skillsinprogress").push(skill.get("_id"));
    user.save();
    res.status(200).json({response: "success"});
  }

  async skipSkill(req, res) {
    console.log("POST /skills/skipSkill");

    //complete without XP
    const user = await User.findByIdAndUpdate(req.body.id, {
      $pull: { skillsinprogress: req.body.skillID },
      $addToSet: { skillscompleted: req.body.skillID }
    });
    user.save();
    res.status(200).json({response: "success"});
  }

  async revertSkill(req, res) {
    console.log("POST /skills/revertSkill");

    //Get skill to revoke
    const skill = await Skill.findById(req.body.skillID);

    //complete without XP
    const user = await User.findByIdAndUpdate(req.body.id, {
      $pullAll: { skillsinprogress: skill.get("requires")},
    });
    user.save();
    res.status(200).json({response: "success"});
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

      return res.status(200).json({
        response: "success",
        skill: skill
      });
    });
  }

  async updateSkill(req, res) {
    console.log("POST /skills/update");

    const skill = Skill.findByIdAndUpdate(req.body.id,
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
