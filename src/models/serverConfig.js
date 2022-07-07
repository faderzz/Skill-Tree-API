const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");
const Schema = mongoose.Schema;


/**
 * Server Config
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: false
  },
  password: {
    type:String,
    required: false,
  },
  discordid: {
    type: String,
    required: false,
  },
  xp:{
    type:Number,
    required:true,
    default:0,
  },
  xpHistory:{
    type: [Number],
    required: true,
    default: [0],
  },
  items:{ 
    type:[Schema.Types.ObjectId],
    required:false,
  },
  skillscompleted:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  skillsinprogress:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  challengescompleted:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  challengesinprogress:{
    type:[Schema.Types.ObjectId],
    required: false,
  },
  character:{
    type:String,
    required:false,
    default:"male",
  },
  timezone:{
    type: Number,
    required: true,
    default: 0,
  },
  baselocation:{
    type: String,
    default: function() {
      return this.discordid;
    },
    required: true,
  },
  lastTracked:{
    type: Date,
    default: new Date(),
    required: true,
  },
  numDaysTracked:{
    type: Number,
    default: 0,
    required: true,
  },
},
{collection: process.env.ENVIRONMENT_TYPE === "development" ? "UsersDev" : "Users"}
);
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// will encrypt password everytime its saved
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model("User",UserSchema);