require("dotenv").config();
const log = require("npmlog");
const express = require("express");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

const PORT = process.env.PORT || 8080;

const app = express();

mongooseLoader();
expressLoader(app);
const cors = require("cors");


app.disable("x-powered-by");
log.info(`Environment-type:${process.env.ENVIRONMENT_TYPE}`);

if (process.env.ENVIRONMENT_TYPE === "development") {
  const swagger_port = parseInt(PORT)+1;
  app.use(cors());
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));
  log.info(`API documentation: http://localhost:${swagger_port}/api-docs`);
  app.listen(swagger_port, () => log.info(`Swagger: Listening on port ${swagger_port}`));
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

app.listen(PORT, () => console.log("Listening on port " + process.env.PORT))
  .on("error", function() {
    process.once("SIGUSR2", function() {
      process.kill(process.pid, "SIGUSR2");
    });
  });
