const express = require("express");
const controller = require("../../controllers/config.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, controller.getAllServerConfigs);
router.get("/getConfig", auth, controller.getServerConfig);
router.put("/setConfig", auth, controller.updateServerConfig);
module.exports = router;
