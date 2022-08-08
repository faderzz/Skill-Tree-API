const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

/**
 * Challenge Object
 * @param goals - The success condition(s) for the challenge to be complete
 * @param xp - The amount of XP granted upon completion of the challenge
 * @param category - The branch that this node is part of
 * @param requirements - The skills required to unlock this challenge
 */
const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  goals: [{
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
  link: {
    type: String,
  },
}, { collection: config.isDevelopment ? "ChallengesDev" : "Challenges"});

module.exports = mongoose.model("Challenge", challengeSchema);
