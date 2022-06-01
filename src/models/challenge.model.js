const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Challenge Object
 * @param goal - The success condition for the challenge to be complete
 * @param xp - The amount of XP granted upon completion of the challenge
 * @param category - The branch that this node is part of
 * @param requirements - The skills required to unlock this challenge
 */
const challengeSchema = new Schema({
  goal: [{
    type: String,
    required: true,
  }],
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
}, { collection: "Challenges" });

module.exports = mongoose.model("Challenge", challengeSchema);
