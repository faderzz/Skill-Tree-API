const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * User Object
 * @param username - user's username
 * @param password - hash of users password (Salt it, duh)
 * @param skill_data - a list of current progression through skill tree?
*/
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    skill_data: {
        type: [Schema.Types.Array],
        required: false
    }
}, {collection: 'userInfo'})

module.exports = mongoose.model('User', userSchema)