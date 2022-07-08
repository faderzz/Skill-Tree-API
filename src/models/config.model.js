const { ServerClosedEvent } = require("mongodb");
const mongoose = require("mongoose");
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
    prefix: {
        type: String,
        required: true,
        unique: false,
        default: "~"
    },
    modLogChannel: {
        type: String,
        required: true,
        unique: false,
        default: "mod-log"
    },
    modRole: {
        type: String,
        required: true,
        unique: false,
        default: "Moderator"
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
    commandReply: {
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
    welcome: {
        type: Boolean,
        required: true,
        unique: false,
        default: false
    }
}, { collection: process.env.ENVIRONMENT_TYPE === "development" ? "ServerConfigsDev" : "ServerConfigs" });

serverSchema.pre("updateOne", function(next) {
    console.log(this.getUpdate());
    next();
});

module.exports = mongoose.model("Server", serverSchema);
