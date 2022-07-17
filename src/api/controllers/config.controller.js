const Server = require("../../models/config.model");

class ServerController {
  async getAllServerConfigs(req, res) {
    try {
      const serverConfigs = await Server.find();
      res.status(200).json({
        success: true,
        data: serverConfigs
      });
    }
    catch (err) {
      res.status(500).json({
        success: false,
        error: err
      });
    }
  }

  async getServerConfig(req, res) {
    console.log("GET /getConfig");

    // Check if serverId was provided and return error if not
    if (!req.body.serverId) {
      return res.status(400).json({
        response: "error",
        message: "Missing serverId"
      });
    }

    // Find server config by serverId
    const serverConfig = await Server.findOne({
      serverId: req.body.serverId
    });

    // If there is no server config, create one using the default values and return it
    if (!serverConfig) {
      const serverConfig = new Server({
        serverId: req.body.serverId
      });

      serverConfig.save();
      return res.status(201).json({
        response: "success",
        serverConfig: serverConfig
      });
    }
    
    // Return server config
    return res.status(200).json({
      response: "success",
      serverConfig: serverConfig
    });
  }

  async updateServerConfig(req, res) {
    console.log("PUT /updateConfig");
    // Check if serverId was provided and return error if not
    if (!req.body.serverId) {
      return res.status(400).json({
        response: "error",
        message: "Missing serverId"
      });
    }

    // Get old config
    const oldConfig = await Server.findOne({
      serverId: req.body.serverId
    });

    // Combine all the new config values into one object
    const newConfig = Object.assign(oldConfig || {}, req.body);
    
    
    // Check for null values and set them to their default values
    for (const key in Server.schema.obj) {
      if (newConfig[key] === undefined && Server.schema.obj[key].default) {
        newConfig[key] = Server.schema.obj[key].default;
      }
    }
    
    // Update the config
    const updatedConfig = await Server.findOneAndUpdate({
      serverId: newConfig.serverId
    }, newConfig, { new:true });

    // Return the updated config
    return res.status(200).json({
      response: "success",
      serverConfig: updatedConfig
    });
  }

  async deleteServerConfig(req, res) {
    console.log("DELETE /deleteConfig");
    // Check if serverId was provided and return error if not
    if (!req.body.serverId) {
      return res.status(400).json({
        response: "error",
        message: "Missing serverId"
      });
    }

    // Delete the config
    const deletedConfig = await Server.findOneAndDelete({
      serverId: req.body.serverId
    });

    // Return the deleted config
    return res.status(200).json({
      response: "success",
      serverConfig: deletedConfig
    });
  }
}

module.exports = new ServerController();
