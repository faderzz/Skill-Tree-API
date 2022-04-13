const userModel = require('../../models/user.model');

class UserController{

    async getUser(req, res){
    /*
        #swagger.description = 'Endpoint for retrieving a User'
        #swagger.tags = ['User']
        #swagger.responses[200] = { description: 'User retrieved successfully.' }
        #swagger.produces = ['application/json']
        #swagger.parameters['id'] = {
            in: 'path',
            required: 'false',
            type: 'string',
            description: 'User ID.' } 
    */
        console.log("GET USER")
        const user = await userModel.find()

        if (user != null){
            res.status(200).json(user)
        } else {
            res.status(404)
        }
    }

    async createUser(req, res){
    /*
        #swagger.description = 'Endpoint for getting a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = { description: 'User created successfully.' }
        #swagger.produces = ['application/json']
    */
        console.log("CREATE USER")
            
        // You can use a Model to create new documents using `new`:
        const userDoc = new userModel(req.body)
        userModel.create(req.body).then(() => {
            console.log("created user")
            res.status(201).json(userDoc);
        }).catch((err) => {
            console.log(err)
            res.status(500).json(err);
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