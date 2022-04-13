require('dotenv').config();

const express = require('express');
const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const PORT = 8080;

const app = express();
app.disable('x-powered-by');

mongooseLoader();
expressLoader(app);

app.listen(PORT, () => {
  console.log('Server is running! \nListening on port ' + PORT)
});

if (process.env.ENVIRONMENT_TYPE == "development"){
  app.use(
    '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile, { explorer: true })
    );
  console.log('API documentation:  http://localhost:' + PORT + '/api-docs/')
}


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})