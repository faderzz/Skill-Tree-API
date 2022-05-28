const TaskController = require("../../controllers/task.controller");
var express = require("express");
var router = express.Router();

router.get("/currentTasks", TaskController.currentTasks);
router.get("/recentTasks", TaskController.recentTasks);
router.post("/updateTask",TaskController.updateTask);


module.exports = router;