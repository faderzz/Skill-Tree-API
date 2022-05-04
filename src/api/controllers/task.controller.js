const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const {intervalToInt} = require("../../modules/TaskHelper");

class TaskController {
  async currentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const user = await User.findOne({
      discordid: req.headers.discordid
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

    const updateDate = req.body.date;
    const task = Task.find({id: req.body.id});
    const skill = Skill.find({id: task.get("skillID")});
    const data = task.get("data"); //array of booleans

    const frequency = skill.get("frequency");
    const interval = intervalToInt(skill.get("interval"));
    const timelimit = skill.get("timelimit");

    const startDate = task.get("startDate");
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    const blockSize = frequency / interval;
    const period = Math.floor(daysDiff / blockSize) * blockSize;



    //Update task
    //Task.updateOne({id: req.body.id},{completed: });
  }
}


module.exports= new TaskController();