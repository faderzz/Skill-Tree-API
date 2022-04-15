require('dotenv').config();
var log = require('npmlog')
const express = require('express');

const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const PORT = process.env.APP_PORT;

mongooseLoader();
expressLoader(app);

async function startServer() {
  const app = express();
  app.disable('x-powered-by');


if (process.env.ENVIRONMENT_TYPE == "development"){
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
  log.info(`API documentation:  http://localhost:${PORT}/api-docs/`);
  app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
}

process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    log.info('HTTP server closed')
  })
})