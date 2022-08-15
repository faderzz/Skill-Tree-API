const log = require("npmlog");
const express = require("express");
const config = require("./config");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");
const swaggerLoader = require("./loaders/swaggerLoader");

function startServer() {
  log.info(`Environment-type: ${process.env.NODE_ENV}`);

  const app = express();

  mongooseLoader();
  expressLoader(app);
  swaggerLoader(app);

  app.listen(config.app.port, () => console.log(`API listening on port ${config.app.port}`))
    .on("error", function() {
      process.once("SIGUSR2", function() {
        process.kill(process.pid, "SIGUSR2");
      });
    });
}

startServer();

process.on("SIGTERM", () =>{
  log.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", function() {
  log.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
