const Skill = require('../../models/skill.model');

class SkillController {
  async getSkills(req, res) {
  /*
    #swagger.description = 'Endpoint for getting a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[200] = { description: 'Skill retrieved successfully.' }
    #swagger.produces = ['application/json'] 
  */
    console.log('GET /skills');

    const skills = await Skill.find({});
    console.log(skills)

    res.status(200).json(skills);
  }

  
  createSkill(req, res) {
  /*
    #swagger.description = 'Endpoint for creating a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[201] = { description: 'Skill created successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'Skill ID.' } 
  */
    console.log('POST /skills');

    const skill = new Skill(req.body);
    skill.save();
    

    res.status(201).json(skill);
  }


  editSkill(req, res) {
  /* 
    #swagger.description = 'Endpoint for editing a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[201] = { description: 'Skill edited successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'Skill ID.' } 
  */
    console.log("UPDATE /skills")
    const skill = new Skill(this.getSkills(res.id))
    res.status(201).json(skill);
  }

 
  deleteSkill(req, res) {
   /* 
    #swagger.description = 'Endpoint for deleting a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[201] = { description: 'Skill deleted successfully.' }
    #swagger.produces = ['application/json']
  */
    res.status(201).json(skill);
  }
}

module.exports = new SkillController();
