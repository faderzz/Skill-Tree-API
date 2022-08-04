const mongoose = require("mongoose");
const config = require("../config");

function load() {
  mongoose.connection.on("connect", () => console.log("MongoDB connected"));

  mongoose.connect(config.database.key, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      console.log("Error: ",err);
    } else {
      console.log("Connected to db successfully");
    }
  });
}

module.exports = load;
