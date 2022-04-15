const mongoose = require('mongoose');
var log = require('npmlog')
require('dotenv').config();

// const HOST_NAME = 'host.docker.internal:27017';
const MY_USER = process.env.DB_USER;
const MY_PASSWORD = process.env.DB_PASSWORD;
const MY_SERVER = process.env.DB_SERVER_URL;
const MY_PORT = process.env.DB_SERVER_PORT != null ? "" : process.env.DB_SERVER_PORT;
const DB_NAME = process.env.DB_NAME;
const CONNECTION_TYPE = process.env.ENVIRONMENT_TYPE == "development" ? "mongodb://" : "mongodb+srv://"

const URL = `${CONNECTION_TYPE}${MY_USER}:${MY_PASSWORD}@${MY_SERVER}:${MY_PORT}`
log.verbose(URL)
// mongodb://AzureDiamond:<password>@localhost:27017/<database>

const db = mongoose.connection;

function load() {
  mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});
  db.useDb(DB_NAME);
  db.on('connect', () => log.info('MongoDB connected'));
  db.on('error', (error) => {
    log.warn('Warning', error);
    });  
  db.once("open", function() {
    log.info("Connected successfully");
  })
}

module.exports = load;
