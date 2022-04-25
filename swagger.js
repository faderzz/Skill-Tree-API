const swaggerAutogen = require("swagger-autogen")({openapi:"3.0.0"});
const log = require("npmlog");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const doc = {
  info: {
    version: "1.0.0",
    title: "Skill Tree API-Plaform",
    description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
  },
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      "name": "User",
      "description": "The endpoints for User information"
    },
    {
      "name": "Skills",
      "description": "The endpoints for Skills"
    }
  ],
  securityDefinitions: {
    apiKeyAuth:{
      type: "apiKey",
      in: "header",
      name: "API-KEY",
      description: "A key used to communicate with the API"
    }
  },
  definitions: {
    User: {
      username: "John_Doe",
      password: "mias87dh32d7h36gdasdghyh1ds8326ga6w8d",
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      exp:1500,
      level:5,
      items:[Schema.Types.ObjectId],
      skillscompleted:[Schema.Types.ObjectId],
      skillsinprogress:[Schema.Types.ObjectId],
    },
    Skill: {
      iconName: "Icon_A",
      title: "Example_I",
      level: "",
      goal: "",
      time: "",
      frequency: ["daily","weekly","monthly", "annually"],
      xp: 10,
      category: "",
      requirements: [],
      children: []
    },
    AddSkill: {
      iconName: "Icon_A",
      title: "Example_I",
      level: "",
      goal: "",
      time: "",
      frequency: ["daily","weekly","monthly", "annually"],
      xp: 10,
      category: "",
      requirements: [],
      children: []
    },
    AddUser: {
      username: "John_Doe",
      password: "mias87dh32d7h36gdasdghyh1ds8326ga6w8d",
      pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      exp:1500,
      level:5,
      items:[Schema.Types.ObjectId],
      skillscompleted:[Schema.Types.ObjectId],
      skillsinprogress:[Schema.Types.ObjectId],
    },

  },

  servers: [
    {
      url: "http://localhost:8080/",
      description: "Development server",
    }
  ]
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/api/routes/v1/*.routes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./src/index");
}).catch((err) => {
  log.error(err);
});