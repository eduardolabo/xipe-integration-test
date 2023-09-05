# PokeAPI Integration

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Visual Studio Code](https://code.visualstudio.com/download)

## Getting Started
1. Clone the repository.
2. Open the project in Visual Studio Code.
3. Open a terminal in Visual Studio Code.
4. Run `docker compose up` to start the application.

## Swagger
- http://localhost:8080/api/api-docs

## Credentials
- Username: xipeadmin
- Password: CarreraAdmin

## Tournament Endpoint
- GET http://localhost:8080/api/tournament

## Tools
- [Postman](https://www.postman.com/downloads/)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Debug in Visual Studio Code
1. Open the project in Visual Studio Code.
2. Open a terminal in Visual Studio Code.
3. Run `docker compose -f docker-compose.debug.yml up` to start the mongodb container.
4. Go to the debug tab in Visual Studio Code.
5. Select `Debug API` from the dropdown.
6. Click the play button to start debugging.

## Known Issues
- You need to delete the `api/node_modules` folder to switch between debug and docker mode.
