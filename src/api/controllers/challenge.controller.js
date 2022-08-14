const Challenge = require("../../models/challenge.model");

class ChallengeController {
  async getChallenges(req, res) {
    try {
      const challenges = await Challenge.find({});
      
      res.status(200).json({
        response: "success",
        challenges: challenges
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get challenges" });
    }
  }

  async createChallenge(req, res) {
    try {
      const challenge = new Challenge(req.body);
      challenge.save();

      return res.status(201).json({
        response: "success",
        challenge: challenge
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to create challenge" });
    }
  }

  async updateChallenge(req, res) {
    try {
      const challenge = Challenge.findByIdAndUpdate(req.body.id, { $set: req.body });
      challenge.save();

      res.status(200).json({ response: "success" });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to update challenge" });
    }
  }

  async deleteChallenge(req, res) {
    try {
      Challenge.findByIdAndDelete(req.body.id);
      res.status(200).json({ response: "success" });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to delete challenge" });
    }
  }
}

module.exports = new ChallengeController();
