require('dotenv').config();

const express = require('express');

const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');

const PORT = 8080;

async function startServer() {
  const app = express();

  await mongooseLoader();
  await expressLoader(app);

  app.listen(PORT, () => console.log('Listening on port ' + PORT));
}

startServer();
