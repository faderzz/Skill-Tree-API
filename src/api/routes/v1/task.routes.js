const TaskController = require("../../controllers/task.controller");
const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/currentTasks", auth, TaskController.currentTasks);
router.get("/recentTasks", auth, TaskController.recentTasks);
router.post("/updateTask", auth, TaskController.updateTask);


module.exports = router;