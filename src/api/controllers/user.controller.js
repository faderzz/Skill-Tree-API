const userModel = require('../../models/user.model');
var log = require('npmlog')

class UserController{

    async getUser(req, res){
    /*
        #swagger.description = 'Endpoint for retrieving a User'
        #swagger.tags = ['User']
        #swagger.responses[200] = {
            schema: { "$ref": "#/definitions/User" },
            description: "User registered successfully." 
        } 
        #swagger.produces = ['application/json']
        #swagger.parameters['_id'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'User ID.' 
        } 
    */
        log.verbose("GET USER")
        await userModel.validate(req.query, ['_id'])
        const user = await userModel.findById(req.query,{maxTimeMS:500}).catch((err) => log.warn(err))

        if (user != null){
            res.status(200).json(user)
        } else {
            log.warn(`Cannot find user with query: ${req.query}`)
            res.status(404)
        }
    }

    async createUser(req, res){
    /*
        #swagger.description = 'Endpoint for getting a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User created successfully.' }
        #swagger.produces = ['application/json']
        #swagger.requestBody = { 
            required: true,
            description: 'User information.',
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/AddUser" }
                }
            }
        }
    */
        log.verbose("CREATE USER")
            
        const userDoc = new userModel(req.body)
        await userModel.create(userDoc).then(() => {
            log.verbose("created user")
            res.status(201).json(userDoc)
        }).catch((err) => {
            log.error(err)
            res.status(500)
        })
    }

    async updateUser(req, res){
    /* 
    #swagger.description = 'Endpoint for editing a User'
    #swagger.tags = ['User']
    #swagger.responses[201] = { description: 'User edited successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'User ID.' } 
    */

    }

    async deleteUser(req,res){
    /* 
        #swagger.description = 'Endpoint for deleting a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User deleted successfully.' }
        #swagger.produces = ['application/json']
    */
    }

}

module.exports = new UserController();