const express = require('express');
const routes = require('../api/routes');

function load(app) {
  app.disable('x-powered-by');

  // Setup middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Load routes
  app.use('/', routes);
}

module.exports = load;
