const express = require("express");
const treeController = require("../../controllers/tree.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/getTree", auth, treeController.getTree);
module.exports = router;
