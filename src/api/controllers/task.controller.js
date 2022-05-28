const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const Item = require("../../models/item.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/TaskHelper");
const {getDaysBetweenDates} = require("../../modules/DateHandler");

class TaskController {
  async currentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const tasks = await Task.find({
      completed: false,
      userID: req.headers["userid"],
    }).populate({path: "skillID", model: Skill}).lean();

    //Show only current goals from goal list
    for (let i = 0; i < tasks.length; i++) {
      const skill = tasks[i]["skillID"];
      if (skill["goal"].length === 1) {
        skill["goal"] = skill["goal"][0];
      } else {
        const startDate = new Date(tasks[i]["startDate"]);
        const daysDiff = getDaysBetweenDates(new Date(), startDate);
        //Split goals into equal sections covering the time limit for the given frequency
        const blockSize = skill["goal"].length * (skill["frequency"] / intervalToInt(skill["interval"])) / skill["timelimit"];
        //get number of completions within the last block period
        const numChecked = tasks[i]["data"].splice(0,daysDiff).filter((v) => v).length;
        
        const goalIndex = numChecked / blockSize;
        skill["goal"] = skill["goal"][goalIndex];
      }
    }
    res.status(200).json(tasks);
  }

  async recentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const tasks = await Task.find({
      userID: req.headers["userid"],
      //find tasks
      $cond: {
        if: {$eq: ["$complete", true]},
        then: {
          $lt: [getDaysBetweenDates(new Date("$endDate"), new Date()), req.body.timelimit]
        },
      }
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
    const skill = await Skill.findById(task.get("skillID"))
      .populate("children.list", null, [Item, Skill]);
    console.log(await skill.populate());
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
