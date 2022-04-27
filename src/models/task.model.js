const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Task Object
 * @param skillID - The ID of the skill object
 * @param user - The ID of the user completing this task
 * @param tasks - List of boolean values representing completed/uncompleted skills for each time period from the start date
 * @param startDate - The date that this skill was started
 */
const taskSchema = new Schema({
  skillID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: false
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: false
  },
  tasks: {
    type: [Boolean],
    required: true,
    unique: false
  },
  startDate: {
    type: Date,
    required: true,
  },
}, { collection: "Tasks" });

module.exports = mongoose.model("Task", taskSchema);
