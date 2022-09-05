const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

/**
 * Item object
 * @param name - item name
 * @param link - URL link
 * @param requires - The required skills to unlock
 * @param emoji - Emoji representing this item
 */
const serverSchema = new Schema({
  serverId: {
    type: String,
    required: true,
    unique: true
  },
  adminRole: {
    type: String,
    required: true,
    unique: false,
    default: "Administrator"
  },
  systemNotice: {
    type: Boolean,
    required: true,
    unique: false,
    default: true
  },
  botChannel: {
    type: String,
    required: false,
    unique: false,
    default: null
  },
  hidden: {
    type: String,
    required: false,
    unique: false,
    default: true
  },
  promotionRole: {
    type: String,
    required: false,
    unique: false,
    default: ""
  },
  promotionThreshold: {
    type: Number,
    required: false,
    unique: false,
    default: -1,
  }
}, { collection: config.isDevelopment ? "ServerConfigsDev" : "ServerConfigs" });

module.exports = mongoose.model("Server", serverSchema);
