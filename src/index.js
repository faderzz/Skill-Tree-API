require('dotenv').config();
var log = require('npmlog')
const express = require('express');

const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const PORT = process.env.APP_PORT;

const app = express();
app.disable('x-powered-by');


mongooseLoader();
expressLoader(app);

app.listen(PORT, () => {
  log.info('Server is running!')
  log.info(`Listening on port ${PORT}`)
});

if (process.env.ENVIRONMENT_TYPE == "development"){
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
  log.info(`API documentation:  http://localhost:${PORT}/api-docs/`);
}

process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    log.info('HTTP server closed')
  })
})