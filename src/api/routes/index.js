const express = require("express");
const skillRouter = require("./v1/skill.routes");
const userRouter = require("./v1/user.routes");
const taskRouter = require("./v1/task.routes");
const itemRouter = require("./v1/item.routes");
const challengeRouter = require("./v1/challenge.routes");
const configRouter = require("./v1/config.routes");
const routes = require("./v1/routes");

const router = express.Router();

router.use("/v1/skills", skillRouter);
router.use("/v1/items", itemRouter);
router.use("/v1/challenges", challengeRouter);
router.use("/v1/users", userRouter);
router.use("/v1/tasks", taskRouter);
router.use("/v1/config", configRouter);
router.use("/v1", routes);

module.exports = router;
