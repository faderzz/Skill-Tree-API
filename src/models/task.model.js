const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

/**
 * Task Object
 * @typedef {Object} Task
 * @property skillID - The ID of the skill object if it exists
 * @property challengeID - The ID of the challenge object if it exists
 * @property user - The ID of the user completing this task
 * @property tasks - List of boolean values representing completed/uncompleted skills for each time period from the start date
 * @property startDate - The date that this skill was started
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

/** @type {Task} */
module.exports = mongoose.model("Task", taskSchema);
