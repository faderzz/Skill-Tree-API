const Task = require("../../models/task.model");
const Skill = require("../../models/skill.model");

class TaskController {
  async currentTasks(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }
  }
  
  async updateTask(req, res) {
    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const date = req.body.date;
    const task = Task.find({id: req.body.id});
    const skillPeriod = Skill.find({id: task.get("skillID")});
    const completed = task.get("tasks"); //array of booleans
    const startDate = task.get("startDate");

    //Update task
    //Task.updateOne({id: req.body.id},{completed: });
  }
}


module.exports= new TaskController();