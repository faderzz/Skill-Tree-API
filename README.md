# Skill-Tree-API
API Platform for the Skill Tree project, allowing different services to interact with the backend database

[Tech-Stack](https://www.technologystacker.com/#/stack/sharelink/AdonisAPI-ts506)

## Installation 
- Rename `.env.example` to `.env`
- Set up a [MongoDB Atlas instance](https://www.mongodb.com/docs/atlas/getting-started/)
- Set the environment variables
    - API_KEY - API Key (Shared with the discord bot, can be anything)
    - PORT - The port your API is hosted on, typically 8080 for localhost
    - DB_KEY - The database key of your mongoDB instance, should look like `mongodb+srv://<Username>:<password>@adonis.n0u0i.mongodb.net/Database?retryWrites=true&w=majority`
    - ENVIRONMENT_TYPE - either `DEVELOPMENT` or `DEPLOYMENT`. Should be development for testing
- Run the API

NOTES:
- Your API_URL should look something like http://domain:port/v1/ as all features are on the /v1/ path
