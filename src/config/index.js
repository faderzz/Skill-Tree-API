const dotenv = require("dotenv");
const { getOsEnv, getOsEnvOptional, normalizePort } = require("../lib/env");

dotenv.config();

const config = {
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  app: {
    port: normalizePort(getOsEnv("PORT")),
    domain: getOsEnvOptional("APP_DOMAIN") || "localhost"
  },
  database: {
    key: getOsEnv("DB_KEY")
  },
  swagger: {
    port: normalizePort(getOsEnvOptional("SWAGGER_PORT") || "443")
  },
  apiKey: getOsEnv("API_KEY"),
};

module.exports = config;
