const Server = require("../../models/config.model");

class ServerController {
  async getAllServerConfigs(req, res) {
    try {
      const serverConfigs = await Server.find({},{__v: 0, _id: 0});
      res.status(200).json({
        success: true,
        data: serverConfigs
      });
    }
    catch (err) {
      res.status(400).json({
        success: false,
        error: err
      });
    }
  }

  async getServerConfig(req, res) {
    try {
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
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to get server config" });
    }
  }

  async updateServerConfig(req, res) {
    try {
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

      let updatedConfig;
      if (!oldConfig) {
        updatedConfig = await Server.create(newConfig);
      } else {
        // Update the config
        updatedConfig = await Server.findOneAndUpdate({
          serverId: newConfig.serverId
        }, newConfig);
      }
      updatedConfig.save();

      // Return the updated config
      return res.status(200).json({
        response: "success",
        serverConfig: updatedConfig
      });
    }
    catch (err) {
      console.error(err);
      return res.status(400).json({ response: "Failed to update server config" });
    }
  }

  async deleteServerConfig(req, res) {
    try {
      await Server.findByIdAndDelete(req.body.serverId);
      res.status(200).json({
        success: true,
      });
    }
    catch (err) {
      res.status(400).json({
        success: false,
        error: err
      });
    }
  }
}

module.exports = new ServerController();
