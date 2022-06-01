const Item = require("../../models/item.model");

class ItemController {
  async getItems(req, res) {
    console.log("GET /items");

    const items = await Item.find({});

    res.status(200).json(items);
  }

  async createItem(req, res) {
    console.log("POST /items/create");

    const item = new Item(req.body);

    item.save();
    return res.status(201).json(item);
  }

  async updateItem(req, res) {
    console.log("POST /items/update");

    const item = Item.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    item.save();
    res.status(201);
  }

  async deleteItem(req, res) {
    console.log("POST /items/delete");

    Item.findByIdAndDelete(req.body.id);
    res.status(201);
  }
}

module.exports = new ItemController();
