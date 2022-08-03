const log = require("npmlog");
const express = require("express");
const config = require("./config");
const cors = require("cors");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

const app = express();

mongooseLoader();
expressLoader(app);

log.info(`Environment-type: ${process.env.NODE_ENV}`);

// TODO: Move this to a loader file
if (config.isDevelopment) {
  log.info(`API documentation: http://localhost:${config.swagger.port}/api-docs`);

  app.use(cors());
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));

  app.listen(config.swagger.port, () => log.info(`Swagger: Listening on port ${config.swagger.port}`));

  log.warn("API in DEVELOPMENT mode");
} else {
  log.warn("API in DEPLOYMENT mode");
}

process.on("SIGTERM", () =>{
  log.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", function() {
  log.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

app.listen(config.app.port, () => console.log(`API listening on port ${config.app.port}`))
  .on("error", function() {
    process.once("SIGUSR2", function() {
      process.kill(process.pid, "SIGUSR2");
    });
  });
