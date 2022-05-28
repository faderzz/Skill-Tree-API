const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Task = require("../../models/task.model");

class SkillController {
  async getSkillsInProgress(req, res) {
    console.log("GET /skillsInProgress");
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }
    const user = await User.findById(req.headers["userid"]);
    const skills = await Skill.find({
      _id: {$in : user.get("skillsinprogress")}, 
    });
    res.status(200).json(skills);
  }

  async getSkills(req, res) {
    console.log("GET /skills");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      console.log(req.headers["api_key"]);
      res.status(401);//Unauthorised
      return;
    }

    const skills = await Skill.find({});
    const root = await Skill.find({
      requires: []
    });
    
    res.status(200).json({
      skills: skills,
      root: root
    });
  }

  async getAvailableSkills(req, res) {
    console.log("GET skills/available");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401); //Unauthorised
      return;
    }
    const user = await User.findById(req.headers["id"]);
    const completed = user.get("skillscompleted");

    const skills = await Skill.find({
      _id: {$nin : user.get("skillsinprogress").concat(completed)}, //skill not in progress
      $expr: {$setIsSubset: ["$requires", completed]},
    });

    res.status(200).json(skills);
  }

  async startSkill(req, res) {
    console.log("POST skills/startSkill");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    //Get skill to star
    const skill = await Skill.findById(req.body.skillid);

    const filter = {
      id: req.body.id,
      skillsinprogress: {$ne : skill.get("_id")}, //skill not in progress
    };

    //Add requirement if necessary
    if (skill.get("requires").length !== 0) {
      filter["skillscompleted"] = {$all : skill.get("requires")};
    }

    const user = await User.findOne(filter);

    //If no user found
    if (!user) {
      res.status(409).json({ errCode: 409, message: "No available skills." });
      return;
    }

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
  }

  async createSkill(req, res) {
    console.log("POST skills/create");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const skill = new Skill(req.body);

    skill.validate(async err => {
      if (err) return res.status(400).json({ errCode: 400, message: "Validation failed. Please check your input.", error: err });

      if (await Skill.findOne({ title: skill.title, level: skill.level }).exec()) {
        return res.status(409).json({ errCode: 409, message: "Skill already exists." });
      }

      skill.save();

      return res.status(201).json(skill);
    });
  }

  async updateSkill(req, res) {
    console.log("POST skills/update");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const skill = Skill.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    skill.save();
  }

  async deleteSkill(req, res) {
    console.log("POST skills/create");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    Skill.findByIdAndDelete(req.body.id);
  }
}

module.exports = new SkillController();
