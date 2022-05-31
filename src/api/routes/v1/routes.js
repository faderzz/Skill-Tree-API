const express = require("express");
const controller = require("../../controllers/controller");

const router = express.Router();

router.get("/getNodes", controller.getNodes);
module.exports = router;
