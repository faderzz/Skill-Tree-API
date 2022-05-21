const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/TaskHelper");

class TaskController {
  async currentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const user = await User.findOne({
      _id: req.headers["id"]
    });

    const tasks = await Task.find({
      completed: false,
      userID: user.get("_id"),
    });

    res.status(200).json(tasks);
  }
  
  async updateTask(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const task = Task.find({id: req.body.id});
    const skill = Skill.find({id: task.get("skillID")});
    const data = task.get("data"); //array of booleans

    console.log(data);
    const frequency = skill.get("frequency");
    const interval = intervalToInt(skill.get("interval"));
    const timelimit = skill.get("timelimit");

    const startDate = task.get("startDate");
    const updateDate = req.body.date;
    const timeDiff = updateDate.getTime() - startDate.getTime();
    //Days between skill start and current date
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    // Imagine we're on the 10th day of tracking for a skill which is (3 times per week)
    // we want the index rounded to the nearest whole number of blocks
    // floor(10 / 7) * 7 = 7 (start of the first week
    // then we add the number of instances tracked at the end
    const blockStart = Math.floor(daysDiff / interval) * interval;
    //Get values from blockStart (7) to blockStart + frequency (7 + 3) = 10
    //Filter by true to get number of true values
    const numCompleteInBlock = data.slice(blockStart, blockStart + frequency).filter((value) => value).length;
    const indexOfChange = blockStart + numCompleteInBlock;

    const totalLength = data.length;
    //Add values which aren't in the array, as there is no guarantee the array ends at todays block
    const numEntriesToAdd = indexOfChange - totalLength;
    const updates = Array(numEntriesToAdd).fill(false);

    for (let i = 0; i < updates.length; i++) {
      //Update data field at index totalLength+i
      const index = `data.${totalLength+i}`;
      //Update task with value
      Task.updateOne({id: req.body.id},
        {
          $set : {[index] : updates[i]}
        });
    }

    //Check if we've completed this skill:
    const aggregateData = Array.prototype.push.apply(data, updates);
    console.log(aggregateData);
    const numComplete = aggregateData.slice(-timelimit).filter((value) => value).length;
    if (numComplete > 0.8) {
      await UserController.completeSkill(task.get("userID"), task.get("skillID"));
    }
  }
}


module.exports= new TaskController();
