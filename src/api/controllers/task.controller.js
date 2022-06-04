const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/taskHelper");
const {getDaysBetweenDates, dayToDate} = require("../../modules/dateHelper");

class TaskController {
  async currentTasks(req, res) {
    console.log("GET /tasks/currentTasks");

    const tasks = await Task.find({
      completed: false,
      userID: req.headers["userid"],
    }).populate({path: "skillID", model: Skill}).lean();

    const user = await User.findById(req.headers["userid"]);
    const offset = user.get("timezone") * 3600000;
    const userDate = new Date(new Date().getTime() + offset);

    //Show only current goals from goal list
    for (let i = 0; i < tasks.length; i++) {
      const skill = tasks[i]["skillID"];
      if (skill["goal"].length === 1) {
        skill["goal"] = skill["goal"][0];
      } else {
        const startDate = new Date(tasks[i]["startDate"]);
        const daysDiff = getDaysBetweenDates(userDate, startDate);
        //Split goals into equal sections covering the time limit for the given frequency
        const blockSize = skill["goal"].length * (skill["frequency"] / intervalToInt(skill["interval"])) / skill["timelimit"];
        //get number of completions within the last block period
        const numChecked = tasks[i]["data"].splice(0,daysDiff).filter((v) => v).length;
        
        const goalIndex = numChecked / blockSize;
        skill["goal"] = skill["goal"][goalIndex];
      }
    }
    res.status(200).json({
      response: "success",
      tasks: tasks
    });
  }

  async recentTasks(req, res) {
    console.log("GET /tasks/recentTasks");

    const user = await User.findById(req.headers["userid"]);
    const offset = user.get("timezone") * 3600000;
    const userDate = new Date(new Date().getTime() + offset);

    const tasks = await Task.find({
      userID: req.headers["userid"],
      //find tasks
      $cond: {
        if: {$eq: ["$complete", true]},
        then: {
          $lt: [getDaysBetweenDates(new Date("$endDate"), userDate), req.body.timelimit]
        },
      }
    }).populate({path: "skillID", model: Skill});

    res.status(200).json({
      response: "success",
      tasks: tasks
    });
  }

  async updateTask(req, res) {
    console.log("POST /tasks/updateTask");

    const task = await Task.findById(req.body.taskid);
    const skill = await Skill.findById(task.get("skillID"));
    const updateuser = await User.findOneAndUpdate({
      _id : {$eq: task.get("userID")},
      $expr : {
        $gt: [getDaysBetweenDates(new Date("$lastTracked"), new Date(new Date().getTime() + "$timezone"*360000)), 0],
      }
    }, {
      lastTracked: new Date(),
      $inc : {numDaysTracked : 1},
    });
    if (updateuser) updateuser.save();

    const user = await User.findById(task.get("userID"));

    let data = task.get("data"); //array of booleans
    if (data === undefined) {
      data = [];
    }

    const checked = req.body.checked;

    const frequency = skill.get("frequency");
    const interval = intervalToInt(skill.get("interval"));
    const timelimit = skill.get("timelimit");

    const startDate = task.get("startDate");

    const offset = user.get("timezone") * 3600000;
    const userDate = new Date(dayToDate(req.body.date).getTime() - offset);

    const indexOfChange = getDaysBetweenDates(new Date(startDate), userDate);
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
      //TODO: Publish and subscribe levelup instead of returning from specific methods
      if (levelUp !== 0) {
        //Get skills/items/challenges which have been unlocked
        //Weird lookup fuckery - do not touch
        unlocked = await Skill.aggregate([
          {"$match": {"_id": {"$eq": task.get("skillID")}}},
          {$limit: 1},
          //Find all items
          { $lookup: {
            from: "Items", let: {"id": "$children"},
            pipeline: [
              {$match: {$expr: {"$in": ["$_id", "$$id"]}}},
              {$set: {type: "Item"}}
            ], as: "items"
          }},
          //Find all skills
          { $lookup: {
            from: "Skills", let: {"id": "$children"},
            pipeline: [
              {$match: {$expr: {"$in": ["$_id", "$$id"]}}},
              {$set: {type: "Skill"}}
            ], as: "skills"
          }},
          //Find all challenges
          { $lookup: {
            from: "Challenges",let: {"id": "$children"},
            pipeline: [
              {$match: {$expr: {"$in": ["$_id", "$$id"]}}},
              {$set: {type: "Challenge"}}
            ], as: "challenges"
          }
          },
        ]);
        //Concatenate each item
        unlocked = [].concat(unlocked[0].skills, unlocked[0].challenges, unlocked[0].items);
      }
    }

    res.status(200).json({
      response: "success",
      levelUp: levelUp,
      unlocked: unlocked,
    });
  }
}


module.exports= new TaskController();
