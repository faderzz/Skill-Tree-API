const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");

class SkillController {
  async getSkills(req, res) {
    console.log("GET /skills");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401); //Unauthorised
      return;
    }

    const skills = await Skill.find({});
    console.log(skills);

    res.status(200).json(skills);
  }

  async createSkill(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    console.log("POST /skills");
    const skill = new Skill(req.body);

    skill.validate(async err => {
      if (err) return res.status(400).json({ errCode: 400, message: "Validation failed. Please check your input.", error: err });
      
      if (await Skill.findOne({ title: skill.title, level: skill.level }).exec()) return res.status(409).json({ errCode: 409, message: "Skill already exists." });

      skill.save();

      return res.status(201).json(skill);
    });
  }

  async startSkill(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    //Get skill to start
    const skill = Skill.findById(req.body.skillID);
    //Get user starting skill
    const user = User.findOne({ userId: req.body.userID});
    //If the user has not already started the skill
    if (user.find({skillsinprogress: req.body.skillID})) {
      res.status(409).json({ errCode: 409, message: "Skill already in progress" });
    }
    //Check if user has requirements for this skill
    if (!user.find({skillscompleted: {$all : skill.get("requirements")}})) {
      res.status(409).json({ errCode: 409, message: "Skill not available" });
    }

    //Update the user to start the skill
    user.get("skillsinprogress").push(req.body.skillID);

    user.save();
  }
}

module.exports = new SkillController();
