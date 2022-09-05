const express = require("express");
const controller = require("../../controllers/config.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, controller.getAllServerConfigs);
router.get("/getConfig", auth, controller.getServerConfig);
router.put("/setConfig", auth, controller.updateServerConfig);
router.post("/deleteConfig", auth, controller.deleteServerConfig);
router.post("/setAutoPromotion", auth, controller.setAutoPromotion);
router.post("/cancelAutoPromotion", auth, controller.cancelAutoPromotion);
module.exports = router;
