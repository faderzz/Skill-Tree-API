const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/dateHelper");
const {getDaysBetweenDates, dayToDate} = require("../../modules/dateHelper");

class TaskController {

  async currentTasks(req, res) {
    console.log("GET /tasks/currentTasks");

    const tasks = await Task.find({
      completed: false,
      userID: req.headers["userid"],
    }, {

    }).populate({path: "skillID", model: Skill}).lean();

    //Show only current goals from goal list
    for (let i = 0; i < tasks.length; i++) {
      const skill = tasks[i]["skillID"];

      if (skill["goal"].length === 1) {
        skill["goal"] = skill["goal"][0];
      } else {
        //Split goals into equal sections covering the time limit for the given frequency
        const blockSize = ((skill["frequency"] / intervalToInt(skill["interval"])) * skill["timelimit"]) / skill["goal"].length;
        //get number of completions within the last block period
        //hacky fix
        const data = tasks[i]["data"].map((x) => x);
        const numChecked = data.splice(-skill["timelimit"]).filter((v) => v).length;
        
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
          $lt: [getDaysBetweenDates(new Date("$endDate" + offset), userDate), req.body.timelimit]
        },
        else: true,
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
    const user = await User.findById(task.get("userID"));
    const offset = user.get("timezone") * 3600000;

    if (user) {
      if (getDaysBetweenDates(user.get("lastTracked").getTime()+offset,
        new Date(new Date().getTime() + offset)) > 0) {

        user.lastTracked = new Date().getTime() + offset;
        user.numDaysTracked += 1;
        user.save();
      }
    }

    let data = task.get("data"); //array of booleans
    if (data === undefined) {
      data = [];
    }

    const frequency = skill.get("frequency");
    const interval = intervalToInt(skill.get("interval"));
    const timelimit = skill.get("timelimit");

    const startDate = task.get("startDate");

    const userDate = new Date(dayToDate(req.body.day).getTime() + offset);

    const checked = req.body.checked;
    let indexOfChange;
    if (interval === -1) {
      indexOfChange = 0;
    } else {
      indexOfChange = getDaysBetweenDates(new Date(startDate + offset), userDate);
    }
    data[indexOfChange] = checked;

    await Task.findByIdAndUpdate(req.body.taskid,
      {
        $set : {
          data: data.map(d => (d === null) ? false : d)
        }
      }, {
        setDefaultsOnInsert: true,
      });

    const numChecked = data.slice(-timelimit).filter((value) => value).length;
    let levelUp = false;
    let unlocked = {};

    //Complete the skill if one of three conditions is met
    //1) If the interval is N/A
    //2) If there are multiple goals, the number of entries is greater than the timelimit,
    // and the goal has a 100% success rate
    //3) There is one goal, the number of entries is more than the timelimit, and there's an 80% success rate
    if (interval === -1 ||
        (skill.get("goal").length !== 1 && data.length > timelimit && numChecked > timelimit * (frequency / interval)) ||
        (skill.get("goal").length === 1 && data.length > timelimit && numChecked > timelimit * (frequency / interval) * 0.8)) {

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

  async deleteTask(req,res) {
    console.log("POST /tasks/deleteTask");
    await Task.findByIdAndDelete(req.body.taskid);
    res.status(200).json({response: "success"});
  }
}


module.exports= new TaskController();
