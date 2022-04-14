const Skill = require('../../models/skill.model');
var log = require('npmlog')
class SkillController {
  async getSkills(req, res) {
  /*
    #swagger.description = 'Endpoint for getting a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[200] = { description: 'Skill retrieved successfully.' }
    #swagger.produces = ['application/json'] 
  */
    log.verbose('GET /skills');

    const skills = await Skill.find({});
    log.verbose(skills)

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
    log.verbose('POST /skills');

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
    log.verbose("UPDATE /skills")
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
    log.verbose("DELETE skill")
    res.status(201).json(skill);
  }
}

module.exports = new SkillController();
