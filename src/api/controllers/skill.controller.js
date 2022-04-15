const Skill = require('../../models/skill.model');

class SkillController {
  async getSkills(req, res) {
    console.log('GET /skills');

    //Validate API-KEY
    if(req.headers["api_key"] !== process.env.API_KEY){
      res.status(401);//Unauthorised
      return;
    }

    const skills = await Skill.find({});
    console.log(skills)

    res.status(200).json(skills);
  }

  createSkill(req, res) {
    console.log('POST /skills');

    const skill = new Skill(req.body);
    skill.save();

    res.status(201).json(skill);
  }

  editSkill(req, res) {}

  deleteSkill(req, res) {}
}

module.exports = new SkillController();
