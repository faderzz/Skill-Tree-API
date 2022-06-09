require("dotenv").config();
const mongoose = require("mongoose");

function load() {
  mongoose.connect(process.env.DB_KEY, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
      console.log("Error: ",err);
    } else {
      console.log("Connected to db successfully");
    }
  });
  //Idk what this does, but it doesn't print anything
  mongoose.connection.on("connect", () => console.log("MongoDB connected"));
}

module.exports = load;
