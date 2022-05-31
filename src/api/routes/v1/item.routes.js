const express = require("express");
const itemController = require("../../controllers/item.controller");

const router = express.Router();

router.get("/", itemController.getItems);
router.post("/createSkill", itemController.createItem);
router.put("/updateItem", itemController.updateItem);
router.delete("/deleteItem", itemController.deleteItem);

module.exports = router;
