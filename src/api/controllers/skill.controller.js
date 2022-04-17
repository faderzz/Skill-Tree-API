const skillModel = require('../../models/skill.model');
var log = require('npmlog')
class SkillController {
  async getSkills(req, res) {
  /*
    #swagger.description = 'Endpoint for getting a skill'
    #swagger.tags = ['Skills']
    #swagger.produces = ['application/json'] 
    #swagger.responses[200] = {
      schema: { "$ref": "#/definitions/Skill" },
      description: "Skill registered successfully." 
    }
  */
    log.info('GET /skills');
    const skills = await Skill.find(req.query);
    log.info(skills)

    res.status(200).json(skills);
  }

  async createSkill(req, res) {
  /*
    #swagger.description = 'Endpoint for creating a skill'
    #swagger.tags = ['Skills']
    #swagger.responses[201] = { description: 'Skill created successfully.' }
    #swagger.produces = ['application/json']
    #swagger.requestBody = { 
            required: true,
            description: 'User information.',
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/AddSkill" }
                }
            }
        }
  */
    log.info('POST /skills');

    const skill = new skillModel(req.body)
    await skillModel.create(skill).then(() => {
      log.info("created skill")
      res.status(201).json(userDoc)
    }).catch((err) => {
      log.error(err)
      res.status(404).json(err)
    })

  }


  async editSkill(req, res) {
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

 
  async deleteSkill(req, res) {
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
