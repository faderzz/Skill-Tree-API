const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Item = require("../../models/item.model");
const UserController = require("../../api/controllers/user.controller");
const {intervalToInt} = require("../../modules/dateHelper");
const {getDaysBetweenDates, dayToDate} = require("../../modules/dateHelper");
const Challenge = require("../../models/challenge.model");

class TaskController {

  async currentTasks(req, res) {
    console.log("GET /tasks/currentTasks");
    const user = await User.findById(req.headers["userid"]);
    const timezone = user.get("timezone");
    const tasks = await Task.find({
      completed: false,
      cancelled: false,
      userID: req.headers["userid"],
    }).populate({path: "skillID", model: Skill})
      .populate({path: "challengeID", model: Challenge})
      .lean();

    //Show only current goals from goal list
    for (let i = 0; i < tasks.length; i++) {
      const skill = tasks[i].skillID;
      const challenge = tasks[i].challengeID;
      tasks[i].startDate = new Date(Date.parse(tasks[i].startDate) + timezone*3600000);
      if (skill) {
        //Get the goal of the skill
        if (skill.goals.length === 1) {
          skill.goal = skill.goals[0];
        } else {
          //N/A can only contain one goal
          if (intervalToInt(skill.interval) === -1) {
            skill.goal = skill.goals[0];
          } else {
            //Split goals into equal sections covering the time limit for the given frequency
            const blockSize = intervalToInt(skill.interval);
            //get number of completions within the last block period
            //hacky fix
            const data = tasks[i]["data"].map((x) => x);
            const numChecked = data.filter((v) => v).length;
            const goalIndex = numChecked / blockSize;
            skill.goal = skill.goals[goalIndex];
            if (goalIndex > skill.goals.length) {
              skill.goal = skill.goals.join(", ");
            }
          }
        }
      }
      if (challenge) {
        const data = tasks[i]["data"].map((x) => x);
        const numChecked = data.filter((v) => v).length;

        challenge.goal = challenge.goals[numChecked];
      }
    }

    res.status(200).json({
      response: "success",
      tasks: tasks,
      timezoneoffset: user.get("timezone")
    });
  }

  async recentTasks(req, res) {
    console.log("GET /tasks/recentTasks");

    const user = await User.findById(req.headers["userid"]);
    const offset = user.get("timezone") * 3600000;
    const userDate = new Date(new Date().getTime() + offset);

    const tasks = await Task.find({
      userID: req.headers["userid"],
      cancelled: false,
      //find tasks
      $cond: {
        if: {$eq: ["$completed", true]},
        then: {
          $lt: [getDaysBetweenDates(new Date("$endDate" + offset), userDate, user.get("timezone")), req.body.timelimit]
        },
        else: true,
      }
    }).populate({path: "skillID", model: Skill})
      .populate({path: "challengeID", model: Challenge});

    res.status(200).json({
      response: "success",
      tasks: tasks,
    });
  }

  async updateTask(req, res) {
    console.log("POST /tasks/updateTask");

    const task = await Task.findById(req.body.taskid)
      .populate({path: "skillID", model: Skill})
      .populate({path: "challengeID", model: Challenge});

    if (task.get("completed") === true) {
      console.log("completed");
      return;
    }

    //Update last tracked
    const user = await User.findById(task.get("userID"));
    const offset = user.get("timezone") * 3600000;
    if (user) {
      if (getDaysBetweenDates(user.get("lastTracked").getTime()+offset,
        new Date(new Date().getTime() + offset), user.get("timezone")) > 0) {

        user.lastTracked = new Date().getTime() + offset;
        user.numDaysTracked += 1;
        user.save();
      }
    }

    //Get task data
    let data = task.get("data");
    if (data === undefined) {
      data = [];
    }

    const skill = task.get("skillID");
    let completed = false;

    const userDate = new Date(dayToDate(req.body.day).getTime() + offset);

    //If not skill, then it's a challenge
    if (skill) {
      const frequency = skill.get("frequency");
      const interval = intervalToInt(skill.get("interval"));
      const timelimit = skill.get("timelimit");

      const startDate = task.get("startDate");

      const checked = req.body.checked;
      let indexOfChange;
      if (interval === -1) {
        indexOfChange = 0;
      } else {
        indexOfChange = getDaysBetweenDates(new Date(Date.parse(startDate) + offset), userDate, user.get("timezone"));
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
      let numChecked;
      const newIndexOfStart = Math.floor((data.length - timelimit) / interval) * interval;
      const limitSize = data.length - newIndexOfStart;
      numChecked = data.slice(-limitSize).filter((v) => v).length;

      if (interval === -1) {
        numChecked = data.filter(Boolean).length;
      }
      if (skill.get("goals").length !== 1) {
        numChecked = data.filter(Boolean).length;
      }
      //Complete the skill if one of three conditions is met
      //1) If the interval is N/A
      //2) If there are multiple goals, the number of entries is greater than the timelimit,
      // and the goal has a 100% success rate
      //3) There is one goal, the number of entries is more than the timelimit, and there's an 80% success rate
      if (interval === -1 && numChecked >= 1 ||
        (skill.get("goals").length !== 1 && data.length >= timelimit && numChecked >= timelimit * (frequency / interval)) ||
        (skill.get("goals").length === 1 && data.length >= timelimit && numChecked >= timelimit * (frequency / interval) * 0.8)) {
        completed = true;
      }
    } else {
      const challenge = task.get("challengeID");
      let lastChanged = task.get("lastChanged");
      let lastGoalIndex = task.get("lastGoalIndex");
      if (!(lastChanged) ||
          getDaysBetweenDates(
            new Date(Date.parse(lastChanged) + offset),
            userDate, user.get("timezone")) > 0) {
        lastChanged = new Date();
        if (!lastGoalIndex) { lastGoalIndex = 0;}
        else {lastGoalIndex += 1;}
      }
      data[lastGoalIndex] = req.body.checked;
      await Task.findByIdAndUpdate(req.body.taskid,
        {
          $set : {
            data: data,
            lastChanged: lastChanged,
            lastGoalIndex: lastGoalIndex,
          }
        }, {
          setDefaultsOnInsert: true,
        });
      const numChecked = data.filter((value) => value).length;
      //Complete challenge if the number of "checked" is equal to the number of goals
      completed = (numChecked === challenge.get("goals").length);
    }

    let levelUp = 0;
    let skills = [];
    let items = [];
    let challenges = [];

    if (completed) {
      levelUp = await UserController.complete(task);

      if (task.get("skillID")) {
        skills = await Skill.find({requires: task.get("skillID").get("_id")});
        items = await Item.find({requires: task.get("skillID").get("_id")});
        challenges = await Challenge.find({requires: task.get("skillID").get("_id")});
      }
    }

    res.status(200).json({
      response: "success",
      levelUp: levelUp,
      skills: skills,
      items: items,
      challenges: challenges,
    });
  }

  async deleteTask(req,res) {
    console.log("POST /tasks/deleteTask");
    await Task.findByIdAndDelete(req.body.taskid);
    res.status(200).json({response: "success"});
  }
}


module.exports= new TaskController();
