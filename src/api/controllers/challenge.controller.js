const Challenge = require("../../models/challenge.model");

class ChallengeController {
  async getChallenges(req, res) {
    console.log("GET /challenges");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      console.log(req.headers["api_key"]);
      res.status(401);//Unauthorised
      return;
    }

    const challenges = await Challenge.find({});
    
    res.status(200).json(challenges);
  }

  async createChallenge(req, res) {
    console.log("POST challenges/create");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const challenge = new Challenge(req.body);

    challenge.save();
    return res.status(201).json(challenge);
  }

  async updateChallenge(req, res) {
    console.log("POST challenges/update");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const challenge = Challenge.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    challenge.save();
  }

  async deleteSkill(req, res) {
    console.log("POST challenges/delete");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    Challenge.findByIdAndDelete(req.body.id);
  }
}

module.exports = new ChallengeController();
