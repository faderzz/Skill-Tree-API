require("dotenv").config();
const log = require("npmlog");
const express = require("express");

const expressLoader = require("./loaders/expressLoader");
const mongooseLoader = require("./loaders/mongooseLoader");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

const PORT = process.env.PORT;

const app = express();

mongooseLoader(); 
expressLoader(app);

app.disable("x-powered-by");
log.info(`Environment-type:${process.env.ENVIRONMENT_TYPE}`);

if (process.env.ENVIRONMENT_TYPE == "development") {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));
  log.info(`API documentation: http://localhost:${PORT}/api-docs`);
  app.listen(PORT, () => log.info(`Listening on port ${PORT}`));
}


process.on("SIGTERM", () =>{
  log.info("SIGTERM signal received: closing HTTP server");
  app.close(() => log.info("HTTP server closed"));
});

app.listen(PORT, () => console.log("Listening on port " + process.env.PORT))
  .on("error", function(err) {
    process.once("SIGUSR2", function() {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function() {
    // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
