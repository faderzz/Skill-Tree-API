const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

/**
 * Task Object
 * @param skillID - The ID of the skill object if it exists
 * @param challengeID - The ID of the challenge object if it exists
 * @param user - The ID of the user completing this task
 * @param tasks - List of boolean values representing completed/uncompleted skills for each time period from the start date
 * @param startDate - The date that this skill was started
 */
const taskSchema = new Schema({
  skillID: {
    type: Schema.Types.ObjectId,
    required: false,
    unique: false
  },
  challengeID: {
    type: Schema.Types.ObjectId,
    required: false,
    unique: false
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: false
  },
  data: {
    type: [
      {
        type: Boolean,
        default: false,
        required: true,
      },
    ],
    required: false,
    unique: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  cancelled: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastChanged: {
    type: Date,
    required: false,
    default: new Date(),
  },
  lastGoalIndex: {
    type: Number,
    required: false,
    default: 0,
  }
}, { collection: config.isDevelopment ? "TasksDev" : "Tasks"});

module.exports = mongoose.model("Task", taskSchema);
