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

    await skillModel.validate(req.query, ['_id'])
    const skills = await skillModel.findById(req.query,{maxTimeMS:500}).catch((err) => log.warn(err))

    if (skills != null){
        res.status(200).json(skills)
    } else {
        log.warn(`Cannot find user with query: ${req.query}`)
        res.status(404)
    }

  }

  async getAllSkills(req, res){
  /*
    #swagger.description = 'Endpoint for getting a skill'
    #swagger.tags = ['Skills']
    #swagger.produces = ['application/json'] 
    #swagger.responses[200] = {
      schema: { "$ref": "#/definitions/Skill" },
      description: "Skill registered successfully." 
    }
  */
    log.info("GET /skills/all")
    const skills = await skillModel.find({},{maxTimeMS:500}).catch((err) => log.warn(err))

    if (skills != null){
        res.status(200).json(skills)
    } else {
        log.warn(`Cannot find user with query: ${req.query}`)
        res.status(404)
    }
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
      res.status(201).json(skill)
    }).catch((err) => {
      log.error(err)
      res.status(404).json(err)
    }).finally(() => {
      log.info(`Finished. Skill: ${skill}`)
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
