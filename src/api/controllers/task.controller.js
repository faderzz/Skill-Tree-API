const Challenge = require("../../models/challenge.model");
const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");
const User = require("../../models/user.model");
const Item = require("../../models/item.model");

const skillService = require("../../services/skill.service");
const { getDaysBetweenDates, intervalToInt } = require("../../lib/dateHelper");

class TaskController {
  async currentTasks(req, res) {
    try {
      // TODO: verify if header is present
      const user = await User.findById(req.headers["userid"]);
      const timezone = user.get("timezone");

      const query = { completed: false, cancelled: false, userID: req.headers["userid"] };
      const tasks = await Task.find(query)
        .populate({ path: "skillID", model: Skill })
        .populate({ path: "challengeID", model: Challenge })
        .lean();

      // Show only current goals from goal list
      for (const task of tasks) {
        const skill = task.skillID;
        const challenge = task.challengeID;

        task.startDate = new Date(Date.parse(task.startDate) + timezone * 3600000);

        if (skill) {
          if (skill.goals.length === 1) {
            skill.goal = skill.goals[0];
          } else {
            // N/A can only contain one goal
            if (intervalToInt(skill.interval) === -1) {
              skill.goal = skill.goals[0];
            } else {
              // Split goals into equal sections covering the time limit for the given frequency
              const blockSize = intervalToInt(skill.interval);

              // get number of completions within the last block period
              const data = task["data"].map((x) => x);
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
          const data = task["data"].map((x) => x);
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
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get current tasks" });
    }
  }

  async recentTasks(req, res) {
    try {
      const user = await User.findById(req.headers["userid"]);
      const offset = user.get("timezone") * 3600000;
      const userDate = new Date(new Date().getTime() + offset);

      let tasks = await Task.find({
        userID: req.headers["userid"],
        cancelled: false,
      }).populate({path: "skillID", model: Skill})
        .populate({path: "challengeID", model: Challenge});

      tasks = tasks.filter(task => {
        if (!task.completed) return true;
        if (getDaysBetweenDates(new Date(new Date(task.startDate).getTime() + offset*3600000 + (task.data.length-1)*86400000),
          userDate, user.get("timezone")) <= req.headers.timelimit) {
          return true;
        }
      });
      res.status(200).json({
        response: "success",
        tasks: tasks,
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get recent tasks" });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await Task.findById(req.body.taskid)
        .populate({path: "skillID", model: Skill})
        .populate({path: "challengeID", model: Challenge});


      if (task.get("completed") === true) {
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
          user.reminderSent = false;
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

      const userDate = new Date(req.body.date + offset);

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

        for (let i = 0; i < data.length; i++) {
          if (data[i] === undefined || data[i] === null) {
            data[i] = false;
          }
        }
        await Task.findByIdAndUpdate(req.body.taskid,
          {
            $set : {
              data: data
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
        for (let i = 0; i < data.length; i++) {
          if (data[i] === undefined || data[i] === null) {
            data[i] = false;
          }
        }
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
        levelUp = await skillService.complete(task);

        if (task.get("skillID")) {
          skills = await Skill.find({ requires: task.get("skillID").get("_id") });
          items = await Item.find({ requires: task.get("skillID").get("_id") });
          challenges = await Challenge.find({ requires: task.get("skillID").get("_id") });
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
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to update task" });
    }
  }

  async deleteTask(req,res) {
    try {
      await Task.findByIdAndDelete(req.body.taskid);
      res.status(200).json({ response: "success" });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to delete task" });
    }
  }
}

module.exports= new TaskController();
