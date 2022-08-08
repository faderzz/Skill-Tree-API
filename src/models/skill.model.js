const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

/**
 * Skill Object
 * @param iconName - image filename for the icon to be displayed, relative to "/icons/" folder
 * @param title - Skill title (READING)
 * @param level - Skill level (3)
 * @param goal - The success condition for the skill to be complete
 * @param time - The time frequency of which to perform the skill
 * @param frequency - The time limit for which you need to maintain the skill before acquiring it
 * @param xp - The amount of XP granted upon completion of the skill
 * @param category - The branch that this node is part of
 * @param requirements - The skills required to unlock this one
 */
const skillSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    unique: false
  },
  goals: [{
    type: String,
    required: true,
  }],
  frequency: {
    type: Number,
    required: true,
  },
  interval: {
    type: String,
    enum: ["day", "week", "month", "year", "N/A"],
    required: true,
  },
  timelimit: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  requires: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
}, { collection: config.isDevelopment ? "SkillsDev" : "Skills" });

// Makes sure that the iconName and level have to be duplicates in order to throw an error.
// If the index doesn't behave as expected, I've found that dropping the collection and having mongoose create it automatically fixes it.
skillSchema.index({ title: 1, level: 1}, { unique: true });

module.exports = mongoose.model("Skill", skillSchema);
