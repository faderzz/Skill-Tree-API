require("dotenv").config();

const express = require("express");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");

async function startServer() {
  const app = express();

  await mongooseLoader();
  await expressLoader(app);

  app.listen(process.env.PORT, () => console.log("Listening on port " + process.env.PORT));
}

startServer();
