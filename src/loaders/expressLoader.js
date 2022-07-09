const express = require("express");
const routes = require("../api/routes");
const cors = require("cors");

function load(app) {
  app.disable("x-powered-by");
  app.use(cors({origin: "*"}));

  // Setup middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Load routes
  app.use("/", routes);
}

module.exports = load;
