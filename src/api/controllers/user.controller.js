const log = require("npmlog");

const Task = require("../../models/task.model");
const User = require("../../models/user.model");
const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const Challenge = require("../../models/challenge.model");
const difficultyConfig = require("../../config/difficulty.config");

class UserController {
  async deleteUser(req,res) {
    try {
      await User.findByIdAndDelete(req.body.userid);

      // get all tasks related to the user
      const tasks = await Task.find({ userID: req.body.userid });

      tasks.map(async (task) => {
        Task.findByIdAndDelete(task._id);
      });

      res.status(200).json({ response: "success" });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to delete user" });
    }
  }

  async profile(req, res) {
    try {
      // TODO: verify if the header is present
      const user = await User.findById(req.headers["id"])
        .populate({path: "skillscompleted", model: Skill})
        .populate({path: "skillsinprogress", model: Skill})
        .populate({path: "challengescompleted", model: Challenge})
        .populate({path: "challengesinprogress", model: Challenge})
        .populate({path: "items", model: Item});

      if (!user) {
        return res.status(409).json({ response: "error", error: "Invalid user" });
      }

      res.status(200).json({
        response: "success",
        user: user,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get user profile" });
    }
  }

  async authUserDiscord(req, res) {
    try {
      // TODO: verify if the header is present
      const user = await User.findOne({ discordid: req.headers["discordid"] });

      let id = null;

      if (user) {
        id = user.get("_id");
      }

      res.status(200).json({
        response: "success",
        id: id
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to authenticate using Discord" });
    }
  }

  async authUser(req, res) {
    /*
        #swagger.description = 'Endpoint for authentifying a User'
        #swagger.tags = ['User']
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'Username' 
        }
        #swagger.parameters['password'] = {
            in: 'query',
            required: 'false',
            type: 'string',
            description: 'password' 
        } 
        #swagger.responses[200] = {
            out: ['username','_id']
            description: "User authentified successfully." 
        }
        #swagger.responses[401] = {
          description: "User not found."
        }
        
    */

    try {
      const username = req.body.username;
      const password = req.body.password;

      const user = await User.findOne({ username });

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          username: user.username,
        });
      } else {
        res.status(401).json({ response: "error", error: "cannot find user" });
        log.warn(`Cannot find user with query:  ${req.query}`);
      }
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to authenticate" });
    }
  }

  async register(req, res) {
    /*
        #swagger.description = 'Endpoint for creating a User'
        #swagger.tags = ['User']
        #swagger.responses[201] = {
          description: 'User created successfully.'
           }
        #swagger.produces = ['application/json']
        #swagger.parameters['username'] = {
          in:'query',
          required:false,
          type:'string',
          description:'name of the user'
        }
        #swagger.parameters['password'] = {
            in:'query',
            required:false,
            type:'string',
            description:'password of the user'
        }
        #swagger.parameters['discordid'] = {
            in:'query',
            required:false,
            type:'string',
            description:'discord ID of the user'
        }
        #swagger.requestBody = { 
            required: true,
            description: 'User information.',
        }
        #swagger.security=[{
          "apiKeyAuth":[]
        }]
    */
    try {
      const username = req.body.username;
      const password = req.body.password;

      const userExists = await User.findOne({ username });

      if (userExists) {
        res.status(400).json({response: "error", error: "User already exists"});
      }

      const user = await User.create({
        username,
        password,
      });

      if (user) {
        res.status(201).json({
          response: "success",
          _id: user._id,
          username: user.username,
        });
      } else {
        log.warn(`Cannot find user with query:  ${req.query}`);
        res.status(404).json({response: "error", error: "Cannot find user"});
      }
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to register" });
    }
  }

  async registerDiscord(req, res) {
    try {
      const userExists = await User.findOne({ discordid: req.body.discordid });

      if (userExists) {
        res.status(400).json({response: "error", error: "User already exists"});
        return;
      }

      const difficulty = await difficultyConfig;

      // Extract the data from the chosen difficulty
      if (!await difficulty[req.body.difficulty.toLowerCase()]) {
        console.log(`Invalid difficulty ${req.body.difficulty}`);
        res.status(400).json({response: "error", error: `Invalid difficulty ${req.body.difficulty}`});
        return;
      }
      const completed = await difficulty[req.body.difficulty.toLowerCase()].completed || [];
      const inprogress = await difficulty[req.body.difficulty.toLowerCase()].inprogress || [];
      const items = await difficulty[req.body.difficulty.toLowerCase()].items || [];

      const user = await User.create({
        discordid: req.body.discordid,
        character: req.body.character,
        timezone: req.body.timezone,
        baselocation: req.body.baselocation,
        skillscompleted: completed,
        skillsinprogress: inprogress,
        items: items,
      });

      if (user) {
        //start tasks automatically
        for (let i = 0; i < inprogress.length; i++) {
          const skillID = inprogress[i];
          const task = new Task({
            userID: user.get("_id"),
            skillID: skillID,
            startDate: new Date(),
            data: [],
            completed: false,
          });
          task.save();
        }
        const itemObjects = await Item.find({_id: {$in : items}});

        res.status(201).json({
          response: "success",
          _id: user._id,
          items: itemObjects,
        });
      } else {
        log.warn(`Cannot create user:  ${req.query}`);
        res.status(404).json({response: "error", error: "User already exists"});
      }
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to register using Discord" });
    }
  }

  async updateUserProfile() {
    /* 
    #swagger.description = 'Endpoint for editing a User'
    #swagger.tags = ['User']
    #swagger.responses[201] = { description: 'User edited successfully.' }
    #swagger.produces = ['application/json']
    #swagger.parameters['username','password'] = {
                in: 'path',
                type: 'integer',
                description: 'User ID.' } 
    */
    // log.verbose("UPDATE USER");
    // const user = await User.findOne({username},{password});

    // if (user) {
    //   user.username = req.body.name || user.username;
    //   user.pic = req.body.pic || user.pic;
    //   if (req.body.password) {
    //     user.password = req.body.password;
    //   }

    //   const updatedUser = await user.save();

    //   res.json({
    //     _id: updatedUser._id,
    //     username: updatedUser.username,
    //     pic: updatedUser.pic,
    //   });
    //   log.verbose("User updated");
    // } else {
    //   log.warn(`Cannot find user with query:  ${req.query}`);
    //   res.status(404);
    // }
  }

  async updateXPHistory(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.id, {
        $addToSet: { xpHistory: req.body.xp }
      });

      user.save();

      res.status(200).json({response: "success", error: ""});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to update XP history" });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.userid, {"$set":{
        character: req.body.character,
        difficulty: req.body.difficulty,
        timezone: req.body.timezone,
        baselocation: req.body.baselocation,
      }});

      user.save();

      res.status(200).json({response: "success", error: ""});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to update user" });
    }
  }

  async updateTimezone(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.id, {
        timezone: req.body.timezone,
      });

      user.save();

      res.status(200).json({response: "success", error: ""});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to update timezone" });
    }
  }

  async updateBaseLocation(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.id, {
        baselocation: req.body.baselocation,
      });

      user.save();

      res.status(200).json({response: "success", error: ""});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to update timezone" });
    }
  }

  // TODO: Add pagination
  async getAll(req, res) {
    try {
      const users = await User.find({});

      res.status(200).json({
        response: "success",
        users: users,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get all users" });
    }
  }

  // TODO: Add pagination
  async getAllInTimezone(req, res) {
    try {
      const users = await User.find({
        timezone: req.headers["timezone"],
      });

      res.status(200).json({
        response: "success",
        users: users,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get all users" });
    }
  }

  async getAvailableTasks(req, res) {
    try {
      // TODO: verify if header is present
      const user = await User.findById(req.headers["userid"]);

      const completed = user.get("challengescompleted").concat(user.get("skillscompleted"));
      const userSkills = user.get("skillscompleted").concat(user.get("skillsinprogress"));
      const userChallenges = user.get("challengescompleted").concat(user.get("challengesinprogress"));

      const skills = await Skill.find({
        _id: {$nin : userSkills}, //skill not in progress or completed
        $expr: {$setIsSubset: ["$requires", completed]}, //All requirements met
      });

      const challenges = await Challenge.find({
        _id: {$nin : userChallenges}, //challenge not in progress or completed
        $expr: {$setIsSubset: ["$requires", completed]},//All requirements met
      });

      res.status(200).json({
        response: "success",
        skills: skills,
        challenges: challenges,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get available tasks" });
    }
  }

  async getInProgress(req, res) {
    try {
      // TODO: verify if header is present
      const user = await User.findById(req.headers["userid"]);

      const skills = await Skill.find({
        _id: {$in : user.get("skillsinprogress")},
      });

      const challenges = await Challenge.find({
        _id: {$in : user.get("challengesinprogress")},
      });

      res.status(200).json({
        response: "success",
        skills: skills,
        challenges: challenges,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get available tasks" });
    }
  }

  async getCompleted(req, res) {
    try {
      // TODO: verify if header is present
      const user = await User.findById(req.headers["userid"]);

      const skills = await Skill.find({
        _id: {$in : user.get("skillscompleted")},
      });

      const challenges = await Challenge.find({
        _id: {$in : user.get("challengescompleted")},
      });

      res.status(200).json({
        response: "success",
        skills: skills,
        challenges: challenges,
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to get completed tasks" });
    }
  }

  async startSkill(req, res) {
    try {
      const user = await User.findById(req.body.userid);

      if (user.get("skillsinprogress").length +
        user.get("challengesinprogress").length > 24) {
        res.status(201).json({response: "error", errmsg: "Max 24 skills in progress"});
        return;
      }

      if (user.get("skillsinprogress")
        .concat(user.get("challengesinprogress"))
        .map(v => v.toString())
        .includes(req.body.tostart.toString())) {
        res.status(202).json({response: "error", errmsg: "Already in progress"});
        return;
      }

      //Get skill/challenge to start
      const skill = await Skill.findById(req.body.tostart);
      const challenge = await Challenge.findById(req.body.tostart);
      const child = skill ? skill : challenge;

      if (skill) {
        //Update the user to start the skill
        user.get("skillsinprogress").push(child.get("_id"));
        user.save();

        const task = new Task({
          userID: user.get("_id"),
          skillID: skill.get("_id"),
          startDate: new Date(),
          data: [],
          completed: false,
        });

        task.save();
      } else {
        //Update the user to start the skill
        user.get("challengesinprogress").push(child.get("_id"));
        user.save();

        const task = new Task({
          userID: user.get("_id"),
          challengeID: challenge.get("_id"),
          startDate: new Date(),
          data: [],
          completed: false,
        });

        task.save();
      }

      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to start new skill" });
    }
  }

  async skip(req, res) {
    try {
      //complete without XP
      const skill = await Skill.findById(req.body.toskip);
      const items = await Item.find({requires : req.body.toskip});

      if (skill) {
        const user = await User.findByIdAndUpdate(req.body.userid, {
          $addToSet: {
            skillscompleted: req.body.toskip,
            items: items},
        });

        user.save();
      } else {
        const user = await User.findByIdAndUpdate(req.body.userid, {
          $addToSet: {
            challengescompleted: req.body.toskip,
            items: items},
        });

        user.save();
      }

      const skills = await Skill.find({requires: skill.get("_id")});
      const challenges = await Challenge.find({requires: skill.get("_id")});

      res.status(200).json({
        response: "success",
        skills: skills,
        items: items,
        challenges: challenges
      });
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to skip skill" });
    }
  }

  async revert(req, res) {
    try {
      //Get skill/challenge to start
      const skill = await Skill.findById(req.body.torevert);
      const challenge = await Challenge.findById(req.body.torevert);
      const child = skill ? skill : challenge;

      if (skill) {
        //complete without XP
        const user = await User.findByIdAndUpdate(req.body.userid, {
          $pullAll: { skillscompleted: child.get("requires"), skillsinprogress: child.get("requires")},
        });

        user.save();
      } else {
        //complete without XP
        const user = await User.findByIdAndUpdate(req.body.userid, {
          $pullAll: { challengescompleted: child.get("requires"), challengesinprogress: child.get("requires")},
        });

        user.save();
      }

      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to revert skill" });
    }
  }

  async cancel(req,res) {
    try {
      const user = await User.findByIdAndUpdate(req.body.userid,{
        $pull: {
          skillsinprogress: req.body.tocancel,
          challengesinprogress: req.body.tocancel
        },
      });

      user.save();

      await Task.findOneAndUpdate({
        $and: [{userID: req.body.userid},
          {completed: false},
          {cancelled: false},
          {$or : [
            {skillID: req.body.tocancel},
            {challengeID: req.body.tocancel}
          ]}
        ]
      }, { cancelled: true });

      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to cancel skill" });
    }
  }

  async eraseCompleted(req, res) {
    try {
      const tasks = await Task.find({
        $and: [{
          $or: [{
            skillID: req.body.toerase,
            challengeID: { $exists:false }
          },{
            challengeID: req.body.toerase,
            skillID: { $exists: false },
          }]
        },{
          completed: true
        },{
          userID: req.body.userid,
        }],
      });

      const skill = await Skill.findById(req.body.toerase);
      const challenge = await Challenge.findById(req.body.toerase);
      const child = skill ? skill : challenge;

      let xpChange = 0;

      //If the user actually finished it and got XP, remove the XP
      if (tasks.length !== 0) {
        xpChange = -child.get("xp");
      }

      const user = await User.findByIdAndUpdate(req.body.userid,{
        $pull: {
          skillscompleted: req.body.toerase,
          challengescompleted: req.body.toerase
        },
        $inc: { xp: xpChange }
      });

      user.save();

      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to erase completed skills" });
    }
  }

  async saveWeekly(req, res) {
    try {
      const user = await User.findById(req.body.userid);

      if (!user) {
        return res.status(404).json({ response: "User not found" });
      }

      user["xpHistory"].push(user["xp"]);
      user.save();

      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed to save weekly skills" });
    }
  }

  async setReminded(req, res) {
    try {
      const user = await User.findById(req.body.userid);

      if (!user) {
        return res.status(404).json({ response: "User not found" });
      }

      user.reminderSent = req.body.value;

      user.save();

      res.status(200).json({response: "success"});
    } catch (err) {
      console.log(err);
      res.status(400).json({ response: "Failed toggling reminderSent" });
    }
  }
}

module.exports = new UserController();
