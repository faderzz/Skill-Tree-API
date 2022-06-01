require("dotenv").config();
const mongoose = require("mongoose");

function load() {
  mongoose.connect(process.env.DB_KEY).catch(error => console.error(error));
  //Idk what this does, but it doesn't print anything
  mongoose.connection.on("connect", () => console.log("MongoDB connected"));
}

module.exports = load;
