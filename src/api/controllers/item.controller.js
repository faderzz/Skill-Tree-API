const Item = require("../../models/item.model");

class ItemController {
  async getItems(req, res) {
    try {
      const items = await Item.find({});

      res.status(200).json({
        response: "success",
        items: items
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get items" });
    }
  }

  async createItem(req, res) {
    try {
      const item = new Item(req.body);
      item.save();

      return res.status(201).json({
        response: "success",
        item: item
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to create item" });
    }
  }

  async updateItem(req, res) {
    try {
      const item = Item.findByIdAndUpdate(req.body.id,
        {$set: req.body},
      );

      item.save();
      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to update item" });
    }
  }

  async deleteItem(req, res) {
    try {
      Item.findByIdAndDelete(req.body.id);
      res.status(200).json({response: "success"});
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to delete item" });
    }
  }
}

module.exports = new ItemController();
