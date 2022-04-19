const mongoose = require('mongoose');
const bcrypt =require("bcryptjs");

/**
 * User Object
 * @param username - the name of the user
 * @param password - the password of the user
 * @param pic - the name of the icon of the account relative to /icon/ (probably)
 * @param exp - Total experience earned by the user
 * @param level - The currrent level of the user.
 * @param badges - The list of badges owned by the user
 * @param items - The list of items owned by the user
 */
const UserSchema=mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type:String,
        required:true,
    },
    pic:{
        type:String,
        required:true,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon-25.jpg"
    },
    exp:{
        type:Number,
        required:true,
        default:0,
    },
    level:{
        type:Number,
        required:true,
        default:0,
    },
    badges:{
        type:[String],
        required:false,
    },
    items:{ 
        type:[String],
        required:false,
    }

},{ collection:userInfo}
)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // will encrypt password everytime its saved
  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });


module.exports = mongoose.model('User',UserSchema);