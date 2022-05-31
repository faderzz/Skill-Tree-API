const Item = require("../../models/item.model");

class ItemController {
  async getItems(req, res) {
    console.log("GET /items");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      console.log(req.headers["api_key"]);
      res.status(401);//Unauthorised
      return;
    }

    const items = await Item.find({});

    res.status(200).json(items);
  }

  async createItem(req, res) {
    console.log("POST items/create");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const item = new Item(req.body);

    item.save();
    return res.status(201).json(item);
  }

  async updateItem(req, res) {
    console.log("POST items/update");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    const item = Item.findByIdAndUpdate(req.body.id,
      {$set: req.body},
    );

    item.save();
  }

  async deleteItem(req, res) {
    console.log("POST items/delete");

    //Validate API-KEY
    if (req.headers["api_key"] !== process.env.API_KEY) {
      res.status(401);//Unauthorised
      return;
    }

    Item.findByIdAndDelete(req.body.id);
  }
}

module.exports = new ItemController();
