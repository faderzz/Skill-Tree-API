const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/TaskHelper");

class TaskController {
  async currentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const tasks = await Task.find({
      completed: false,
      userID: req.headers["id"],
    }).populate({path: "skillID", model: Skill});

    res.status(200).json(tasks);
  }

  async updateTask(req, res) {
    console.log("POST tasks/updateTask");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const task = await Task.findById(req.body.taskid);
    const skill = await Skill.findById(task.get("skillID"));
    let data = task.get("data"); //array of booleans
    if (data === undefined) {
      data = [];
    }

    const checked = req.body.checked;

    const frequency = skill.get("frequency");
    const interval = intervalToInt(skill.get("interval"));
    const timelimit = skill.get("timelimit");

    const startDate = task.get("startDate");
    const indexOfChange = new Date(req.body.date).getDate() - new Date(startDate).getDate();
    data[indexOfChange] = checked;

    const newTask = await Task.findByIdAndUpdate(req.body.taskid,
      {
        $set : {[`data.${indexOfChange}`]: checked}
      }, {
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true,
        multi: true,
      });

    newTask.data = newTask.data.map(d => (d === null) ? false : d);
    newTask.save();

    const numChecked = data.slice(-timelimit).filter((value) => value).length;
    let levelUp = false;
    let unlocked = {};
    if (data.length > timelimit &&
        numChecked > timelimit * (frequency / interval) * 0.8) {
      levelUp = await UserController.completeSkill(task.get("userID"), task.get("skillID"));
      unlocked = await skill.populate("children").get("children");
    }

    res.status(200).json({
      levelUp: levelUp,
      unlocked: unlocked,
    });
  }
}


module.exports= new TaskController();
