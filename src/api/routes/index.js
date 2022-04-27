const express = require("express");
const skillRouter = require("./v1/skill.routes");
const userRouter = require("./v1/user.routes");
const taskRouter = require("./v1/task.routes");

const router = express.Router();

router.use("/v1/skills", skillRouter);
router.use("/v1/users", userRouter);
router.use("/v1/tasks", taskRouter);

module.exports = router;
