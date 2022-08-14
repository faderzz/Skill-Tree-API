const express = require("express");
const routes = require("../api/routes");
const cors = require("cors");
const morgan = require("morgan");

function load(app) {
  app.disable("x-powered-by");
  
  // Setup middlewares
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // Load routes
  app.use("/", routes);
}

module.exports = load;
