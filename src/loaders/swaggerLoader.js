const log = require("npmlog");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../../swagger-output.json");
const config = require("../config");

function load(app) {
  if (config.isDevelopment) {
    log.warn("API in DEVELOPMENT mode");
    log.info(`API documentation: http://localhost:${config.swagger.port}/api-docs`);

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, { explorer: true }));
    app.listen(config.swagger.port, () => log.info(`Swagger: Listening on port ${config.swagger.port}`));
  }
}

module.exports = load;
