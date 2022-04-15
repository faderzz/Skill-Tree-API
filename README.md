# ASI-API-Platform

The repository that will handle the API Platform.

[Tech-Stack](https://www.technologystacker.com/#/stack/sharelink/AdonisAPI-ts506)

## Installation

Remove the ".example" from the end of ".env.example" and edit the file to set `DB_KEY` to a valid authentication token for the database. Also set the `ENVIRONMENT_TYPE` to either `production` or `development`.

Ensure that the required packages are installed:

```console
npm install
```

To start the api-platform server execute:

```console
npm start
```

## Development

### Locally hosting MongoDB (Docker)

To locally run a MongoDB server that is containerized, you will need [docker-desktop](https://www.docker.com/products/docker-desktop/) installed. You can run the following command from the same location as the `docker-compose.yml` file to start the container:

```console
docker compose up
```

After the command is run, then you should have a local mongodb server running in container. To connect to it review the configuration in the `docker-compose.yml` file.

### Building the  swagger documentation

To create the swagger-docs execute the following;

```console
npm run swagger-docs
```

After the command is run, the api-platform server will start listening on port 8080, with the docs being available at: `http://localhost:8080/#/api-docs/`