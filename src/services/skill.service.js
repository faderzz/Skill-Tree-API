const Task = require("../models/task.model");
const User = require("../models/user.model");
const Item = require("../models/item.model");

const { levelDiff } = require("../lib/XPHandler");

class SkillService {
  /**
   * Complete a skill/challenge for this user
   * @param {Task} task The task to complete
   */
  async markComplete(task) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(task.get("_id"), {
        completed: true,
        $set: { endDate: new Date() }
      });

      updatedTask.save();

      const skill = await task.get("skillID");

      if (skill) {
        const items = await Item.find({ requires: task.get("skillID").get("_id") });

        const user = await User.findByIdAndUpdate(task.get("userID"), {
          $pull: { skillsinprogress: skill },
          $addToSet: {
            skillscompleted: skill,
            items: items.map(item => item.get("_id"))},
        });

        user.save();

        return this.addXP(task.get("userID"), skill.get("xp"));
      } else {
        const challenge = await task.get("challengeID");

        const user = await User.findByIdAndUpdate(task.get("userID"), {
          $pull: { challengesinprogress: challenge },
          $addToSet: { challengescompleted: challenge }
        });

        user.save();

        return this.addXP(task.get("userID"), challenge.get("xp"));
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  /**
   * Add XP to a given user
   * @param {string} userID The ID of the user
   * @param {number} xp The amount of XP to add
   */
  async addXP(userID, xp) {
    try {
      const user = await User.findByIdAndUpdate(userID, {
        $inc : { "xp" : xp }
      });

      const lastXP = user.get("xp") - xp;
      return levelDiff(lastXP, user.get("xp"));
    }
    catch (err) {
      console.error(err);
    }
  }
}

module.exports = new SkillService();
